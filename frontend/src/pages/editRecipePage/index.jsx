import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from 'axios';
import {
  Typography,
  Container,
} from "@mui/material";
import "./editRecipePage.css";
import { MdEdit } from "react-icons/md";

const EditRecipePage = () => {
  useEffect(() => {
    document.title = "Edit Recipe";
  }, []);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [expectedTime, setExpectedTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('difficulty', difficulty);
    formData.append('expected-time', expectedTime);
    formData.append('ingredients', ingredients);
    formData.append('instructions', instructions);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    // reset from
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
  };

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
            >Cancel</button>
          </div>
        </form>
      </Container>
      <Footer />
    </>
  );
};

export default EditRecipePage;
