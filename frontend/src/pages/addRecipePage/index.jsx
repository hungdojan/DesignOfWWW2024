import React, { useEffect, useState, useRef } from "react";
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
import { MdEdit } from "react-icons/md";

const AddRecipePage = () => {
  useEffect(() => {
    document.title = "New Recipe";
  }, []);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const titleRef = useRef(null);
  const ingredientsRef = useRef(null);
  const descriptionRef = useRef(null);

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

  document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll('.input-field');

    inputs.forEach(input => {
      input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
    });
  });

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

    const preview = document.getElementById('image-preview');
    if (preview) {
      preview.style.display = 'none';
    }

    if (titleRef.current) titleRef.current.style.height = 'auto';
    if (ingredientsRef.current) ingredientsRef.current.style.height = 'auto';
    if (descriptionRef.current) descriptionRef.current.style.height = 'auto';
  };

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
              ref={titleRef}
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
              ref={ingredientsRef}
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
              ref={descriptionRef}
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
