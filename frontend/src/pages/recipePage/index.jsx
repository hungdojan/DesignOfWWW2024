import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Stack,
} from "@mui/material";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import "./recipePage.css";

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (err) {
      setError("Failed to fetch recipe.");
    }
  };

  useEffect(() => {
    document.title = "Recipe";
    fetchRecipe();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="md" className="recipe-box">
        <Card sx={{ boxShadow: 3, marginTop: 1 }}>
          <Typography variant="h4" component="div" className="my-recipes-title" textAlign="center">
            {recipe.name}
          </Typography>

          <Box className="recipe-image">
            <CardMedia
              component="img"
              image={recipe.image}
              alt={recipe.name}
            />
          </Box>

          <CardContent>
            {/* Ingredients Section */}
            <Typography variant="h5" component="div" className="subtitle">
              Ingredients
            </Typography>
            <Stack component="ul" spacing={1} className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <Box component="li" key={index}>
                  <Typography variant="body1">{ingredient.name}</Typography>
                </Box>
              ))}
            </Stack>

            {/* Instructions Section */}
            <Typography variant="h5" component="div" className="subtitle">
              Instructions
            </Typography>
            <Stack component="ol" spacing={1} className="instruction-list">
              {recipe.instructions.split("\n").map((instruction, index) => (
                <Box component="li" key={index}>
                  <Typography variant="body1">{instruction}</Typography>
                </Box>
              ))}
            </Stack>

            {/* Edit Button */}
            <Box>
              <Button
                variant="outlined"
                startIcon={<MdEdit />}
                className="edit-button"
              >
                Edit Recipe
              </Button>
            </Box>
            {/* Delete Button */}
            <Box>
              <Button
                variant="outlined"
                startIcon={<MdDelete />}
                className="delete-button"
              >
                Delete Recipe
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default RecipePage;
