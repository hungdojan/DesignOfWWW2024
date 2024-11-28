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
  const [userID, setUserID] = useState('');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [error, setError] = useState(null);

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

  const fetchFavoriteRecipes = async () => {
    if (!userID) {
      return;
    }
    try {
      const response = await axios.get(`/api/favorites/favorite_recipes/${userID}`);
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
    fetchUserId();
    document.title = "Favorite Recipes";
  }, []);

  useEffect(() => {
    if (userID) {
      fetchFavoriteRecipes();
    }
  }, [userID]);
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
