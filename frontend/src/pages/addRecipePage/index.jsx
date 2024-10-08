import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Button,
} from "@mui/material";
import "./addRecipePage.css";
import { PiCookingPotFill } from "react-icons/pi";
import { MdEdit } from "react-icons/md";

const AddRecipePage = () => {
  useEffect(() => {
    document.title = "New Recipe";
  }, []);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('ingredients', ingredients);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    // Here, you would send the form data to the server
    // using an API endpoint, for example:
    // axios.post('/api/recipes', formData);

    // teset from
    setTitle('');
    setIngredients('');
    setDescription('');
    setImage(null);
  };

  return (
    <>
      <Header />
      <Typography variant="h4" className="my-recipes">
        New Recipes <PiCookingPotFill class="recipe-icon" />
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
            <label htmlFor="ingredients">Ingredients</label>
            <textarea
              id="ingredients"
              value={ingredients}
              className="input-field"
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="List ingredients"
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
              placeholder="Describe the recipe"
              required
            />
          </div>

          <div className="one-item">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              className="add-image"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>

          <button type="submit" className="add-button">Add Recipe</button>
        </form>
      </Container>
      <Footer />
    </>
  );
};

export default AddRecipePage;
