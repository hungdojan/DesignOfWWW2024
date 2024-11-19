import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FoodCard from "../../components/FoodCard";
import {
  Typography,
  Container,
  Grid2,
} from "@mui/material";
import axios from "axios";
import "./favoriteRecipePage.css";

const FavoriteRecipesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [error, setError] = useState(null);

  const fetchFavoriteRecipes = async () => {
    try {
      const uid = "dummy"; // TODO
      const response = await axios.get(`/favorites/favorite_recipes/${uid}/`);
      const recipes = await Promise.all(
        response.data.map(async (recipe) => {
          try {
            const imageResponse = await axios.get(`/api/recipes/${recipe.ID}/image/`, {
              responseType: "blob",
            });
            const imageUrl = URL.createObjectURL(imageResponse.data);
            return { ...recipe, imageUrl };
          } catch (imageError) {
            console.error(`Error fetching image for recipe ${recipe.ID}:`, imageError);
            return { ...recipe, imageUrl: "https://via.placeholder.com/220x140" };
          }
        })
      );
      setFavoriteRecipes(recipes);
    } catch (err) {
      console.error("Error fetching favorite recipes:", err);
      setError("Failed to load favorite recipes.");
    }
  };

  useEffect(() => {
    fetchFavoriteRecipes();
    document.title = "Favorite Recipes";
  }, []);
  return (
    <>
      <Header />
      <Typography variant="h4" className="my-recipes">
        Favorite Recipes
      </Typography>
      <Container maxWidth="md" className="container">
        {error ? (
            <Typography className="empty">{error}</Typography>
          ) : favoriteRecipes === null ? (
            <Typography className="empty">Loading...</Typography>
          ) : favoriteRecipes.length === 0 ? (
            <Typography className="empty">You have no favorite recipes.</Typography>
          ) : (
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="box-grid">
          {favoriteRecipes.map((recipe) => (
            <Grid2 item key={recipe.ID}>
              <FoodCard
                img_src={recipe.imageUrl}
                alt={recipe.name}
                title={recipe.name}
                editable={false}
                id={recipe.ID}
              />
            </Grid2>
          ))}
        </Grid2>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default FavoriteRecipesPage;
