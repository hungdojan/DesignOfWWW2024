import React, { useEffect } from "react";
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
import salmonImage from '../../assets/recipe/salmon.jpg';

const RecipePage = () => {
  const { id } = useParams();

  useEffect(() => {
    document.title = "Recipe";
  }, []);

  const recipe = {
    title: "Salmon Soup",
    image: salmonImage,
    ingredients: [
      "Fish Stock",
      "Diced carrots",
      "Butter",
      "Leek",
      "Cream",
      "Salmon",
      "Dill",
      "Sea salt and freshly ground black pepper",
    ],
    instructions: [
      "Start preparing lohikeitto by placing a medium-sized pan over medium heat.",
      "Add the butter and let it melt.",
      "Once the butter is ready, add leeks and cook until it has softened.",
      "Add diced carrot and potatoes.",
      "Add fish stock and cover the pot with a lid.",
      "Adjust heat to medium-high and bring to a boil.",
      "Adjust heat to medium-low and simmer your salmon soup until the vegetables are almost cooked.",
      "Add the chopped salmon.",
      "Add heavy cream and mix well.",
      "Turn heat into medium and cover the pan with a lid.",
      "Cook your lohikeitto for about four to five minutes.",
      "Add salt, pepper, and dill.",
      "Turn off the heat and cover the pan with a lid.",
      "Keep covered for about two minutes, then transfer into bowls.",
    ],
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* Main Content */}
      <Container maxWidth="md" className="recipe-box">
        <Card sx={{ boxShadow: 3, marginTop: 1 }}>
          <Typography variant="h4" component="div" className="my-recipes-title" textAlign="center">
            {recipe.title}
          </Typography>
          
          {/* Recipe Image Section */}
          <Box className="recipe-image">
            <CardMedia
              component="img"
              image={recipe.image}
              alt={recipe.title}
            />
          </Box>

          {/* Recipe Content Section */}
          <CardContent>
            {/* Ingredients Section */}
            <Typography variant="h5" component="div" className="subtitle">
              Ingredients
            </Typography>
            <Stack component="ul" spacing={1} className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <Box component="li" key={index}>
                  <Typography variant="body1">{ingredient}</Typography>
                </Box>
              ))}
            </Stack>

            {/* Instructions Section */}
            <Typography variant="h5" component="div" className="subtitle">
              Instructions
            </Typography>
            <Stack component="ol" spacing={1} className="instruction-list">
              {recipe.instructions.map((instruction, index) => (
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

      {/* Footer should span full width */}
      <Box sx={{ width: "100%", position: "relative", marginTop: "auto" }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default RecipePage;
