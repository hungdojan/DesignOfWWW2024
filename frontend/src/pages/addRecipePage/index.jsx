import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from 'axios';
import {
  Typography,
  Container,
} from "@mui/material";
import "./addRecipePage.css";
import { MdEdit } from "react-icons/md";

const AddRecipePage = () => {
  const [userID, setUserID] = useState('');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState("Beginner");
  const [expectedTime, setExpectedTime] = useState('');
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const fetchUserId = async () => {
    try {
      axios
      .get("/api/auth/id")
      .then((response) => {
        setUserID(response.data.id);
       });
    } catch (error) {
      console.error("Error fetching user ID:", error.response || error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const preview = document.getElementById('image-preview');
        preview.src = reader.result;
        preview.style.display = 'block';
      };

      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleResize = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: title,
        timeCreated: new Date().toISOString(),
        expectedTime: expectedTime,
        difficulty: difficulty,
        description: description,
        instructions: instructions,
        ingredients: ingredients.map((ingredient) => ({
          name: ingredient.name,
          amount: ingredient.amount,
        })),
      };

      const response = await axios.post(`/api/users/${userID}/recipes`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const recipeId = response.data.ID;

      if (image) {
        const formData = new FormData();
        formData.append('file', image);
    
        await axios.post(`/api/recipes/${recipeId}/image/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        console.log('Image uploaded successfully!');
      } else {
        console.log('No image to upload.');
      }

      // reset form
      setTitle('');
      setDifficulty('');
      setExpectedTime('');
      setIngredients([{ name: "", amount: "" }]);
      setInstructions('');
      setDescription('');
      setImage(null);

      const preview = document.getElementById('image-preview');
      if (preview) {
        preview.style.display = 'none';
      }

      alert("Succesfully added new recipe!");
    } catch (error) {
      console.error("Error adding recipe:", error.response || error.message);
      alert("Failed to add recipe. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserId();
    document.title = "Add Recipe";
  }, []);

  return (
    <>
      <Header />
      <Typography variant="h4" className="my-recipes">
        Add Recipe <MdEdit class="recipe-icon" />
      </Typography>
      <Container className="form-container">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="add-form">
          <div className="one-item">
            <label htmlFor="title">Recipe Title</label>
            <input
              type="text"
              id="title"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Set title"
              maxLength={48}
              required
            />
          </div>

          <div className="one-item">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              className="input-menu"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advance">Advance</option>
            </select>
          </div>

          <div className="one-item">
            <label htmlFor="expected-time">Expected Time</label>
            <div className="input-with-units">
              <input
                type="number"
                id="expected-time"
                className="input-number-field"
                value={expectedTime}
                onChange={(e) => setExpectedTime(e.target.value)}
                placeholder="Enter time"
                min="1"
                required
              />
              <span className="time">minutes</span>
            </div>
          </div>

          <div className="one-item">
            <label htmlFor="ingredients">Ingredients</label>
            <div className="ingredients-section">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  <input
                    type="text"
                    value={ingredient.name}
                    placeholder="Ingredient name"
                    className="input-ingredient"
                    onChange={(e) =>
                      handleIngredientChange(index, "name", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    value={ingredient.amount}
                    placeholder="Amount"
                    className="input-ingredient"
                    onChange={(e) =>
                      handleIngredientChange(index, "amount", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="ingredient-btn"
                  >-</button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="add-ingredient-btn"
            >+</button>
          </div>

          <div className="one-item">
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              value={instructions}
              className="input-field-instruction"
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Add instructions seperated by enter"
              onInput={handleResize}
              required
            />
          </div>

          <div className="one-item">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              className="input-field"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional description ..."
              onInput={handleResize}
              required
            />
          </div>

          <div className="image-container">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              className="add-image"
              onChange={handleImageUpload}
              accept="image/*"
            />
            <label htmlFor="image" className="upload-btn">+</label>
          </div>

          <img id="image-preview" src="" alt="Image Preview" className="image-preview" />

          <button type="submit" className="add-button">Add Recipe</button>
        </form>
      </Container>
      <Footer />
    </>
  );
};

export default AddRecipePage;
