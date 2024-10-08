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
      {/* Header should span full width */}
      <Box sx={{ width: "100%", position: "relative" }}>
        <Header />
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ flex: 1, marginTop: 4 }}>
        <Typography variant="h4" component="div" className="my-recipes-title" textAlign="center">
          {recipe.title}
        </Typography>

        <Card sx={{ boxShadow: 3, marginTop: 4 }}>
          {/* Recipe Image Section */}
          <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <CardMedia
              component="img"
              image={recipe.image}
              alt={recipe.title}
              sx={{
                width: "80%",
                height: { xs: 250, sm: 350, md: 450 },
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          </Box>

          {/* Recipe Content Section */}
          <CardContent sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
            {/* Ingredients Section */}
            <Typography variant="h6" component="div" gutterBottom>
              Ingredients
            </Typography>
            <Stack component="ul" spacing={1} sx={{ paddingLeft: 2, margin: 0 }}>
              {recipe.ingredients.map((ingredient, index) => (
                <Box component="li" key={index}>
                  <Typography variant="body1">{ingredient}</Typography>
                </Box>
              ))}
            </Stack>

            {/* Instructions Section */}
            <Typography variant="h6" component="div" gutterBottom sx={{ marginTop: 2 }}>
              Instructions
            </Typography>
            <Stack component="ol" spacing={1} sx={{ paddingLeft: 3, margin: 0 }}>
              {recipe.instructions.map((instruction, index) => (
                <Box component="li" key={index}>
                  <Typography variant="body1">{instruction}</Typography>
                </Box>
              ))}
            </Stack>

            {/* Edit Button */}
            <Box sx={{ marginTop: 4, display: "flex", justifyContent: "center" }}>
              <Button
                variant="outlined"
                startIcon={<MdEdit />}
                className="edit-button"
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  padding: "8px 16px",
                }}
              >
                Edit Recipe
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
