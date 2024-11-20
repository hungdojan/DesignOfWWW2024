import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
} from "@mui/material";
import "./editRecipePage.css";
import { MdEdit } from "react-icons/md";

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userID, setUserID] = useState('');
  const [imgSrc, setImgSrc] = useState(null);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState("Beginner");
  const [expectedTime, setExpectedTime] = useState('');
  const [ingredients, setIngredients] = useState('');
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

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}/image/`);
        if (response.data?.images_ids?.length > 0) {
          const imageId = response.data.images_ids[0];
          const imageResponse = await axios.get(`/api/images/${imageId}`, { responseType: "blob" });
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setImgSrc(imageUrl);
        } else {
          console.log("No image IDs found in the response.");
        }
      } catch (error) {
        console.error("Error fetching image", error);
      }
    };

    fetchImage();
  }, [id]);

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);
        const recipe = response.data;

        setTitle(recipe.name);
        setDifficulty(recipe.difficulty);
        setExpectedTime(recipe.expectedTime);
        setIngredients(recipe.ingredients.join("\n")); // TODO
        setInstructions(recipe.instructions);
        setDescription(recipe.description);
        if (imgSrc) {
          setImage(imgSrc);
          const preview = document.getElementById('image-preview');
          preview.src = imgSrc;
          preview.style.display = 'block';
        }

      } catch (error) {
        console.error("Error fetching recipe data:", error);
      }
    };

    fetchRecipeData();
  }, [id]);

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
    }
  };

  const handleResize = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ingredientsList = ingredients.split('\n').map(ingredient => {
        const parts = ingredient.split(',').map(part => part.trim());
        
        if (parts.length === 3) {
          const [name, value, unit] = parts;
          return { 
            name: name, 
            value: parseFloat(value) || 0,
            unit: unit 
          };
        } else {
          return { name: "", value: 0, unit: "" };
        }
      }).filter(ingredient => ingredient.name !== "");

      const payload = {
        name: title,
        timeCreated: new Date().toISOString(),
        expectedTime: expectedTime,
        difficulty: difficulty,
        description: description,
        instructions: instructions,
        ingredients: ingredientsList,
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
      setIngredients('');
      setInstructions('');
      setDescription('');
      setImage(null);

      const preview = document.getElementById('image-preview');
      if (preview) {
        preview.style.display = 'none';
      }

      alert("Succesfully edited your recipe!");
    } catch (error) {
      console.error("Error editting recipe:", error.response || error.message);
      alert("Failed to edit recipe. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    document.title = "Edit Recipe";
    fetchUserId();
  }, []);

  return (
    <>
      <Header />
      <Typography variant="h4" className="my-recipes">
        Edit Recipe <MdEdit class="recipe-icon" />
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
              <option value="Expert">Expert</option>
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
            <textarea
              id="ingredients"
              value={ingredients}
              className="input-field"
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="List ingredients separated by enter"
              onInput={handleResize}
              required
            />
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

          <div class="button-group">
          <button
            type="submit"
            className="save-button"
            >Save</button>
          <button
            type="submit"
            className="cancel-button"
            onClick={handleCancel}
            >Cancel</button>
          </div>
        </form>
      </Container>
      <Footer />
    </>
  );
};

export default EditRecipePage;
