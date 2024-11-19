import React, { useEffect, useState } from "react";
import axios from 'axios';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FoodCard from "../../components/FoodCard";
import {
  Typography,
  Container,
  Grid2,
} from "@mui/material";
import "./listRecipePage.css";
import { PiCookingPotFill } from "react-icons/pi";

const ListRecipePage = () => {
  const [recipes, setRecipes] = useState([]);

  // TODO do for current user
  const uid = "c0c07782-1349-4c4e-bb82-f9e9a7b558cf";

  const fetchAllRecipes = () => {
    axios
      .get('/api/recipes/')
      .then((resp) => {
        // fetch images
        Promise.all(
          resp.data.map((recipe) =>
            axios
              .get(`/api/recipes/${recipe.ID}/image/`, { responseType: 'blob' })
              .then((imageResp) => {
                const imageUrl = URL.createObjectURL(imageResp.data);
                return { ...recipe, imageUrl };
              })
              .catch((err) => {
                console.error('Error fetching image for recipe:', recipe.ID);
                return { ...recipe, imageUrl: "https://via.placeholder.com/220x140" };
              })
          )
        ).then((recipes) => {
          setRecipes(recipes);
        });
      })
      .catch((err) => alert('Error fetching recipes: ' + err));
  };

  useEffect(() => {
    fetchAllRecipes();
    document.title = "My Recipes";
  }, []);

  return (
    <>
      <Header />
      <Typography variant="h4" className="my-recipes">
        My Recipes <PiCookingPotFill class="recipe-icon" />
      </Typography>
      <Container maxWidth="md">
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="box-grid">
          {recipes.map((recipe) => (
            <Grid2 item key={recipe.ID}>
              <FoodCard
                img_src={recipe.imageUrl}
                alt={`Recipe ${recipe.name}`}
                title={recipe.name}
                editable={true}
                id={recipe.ID}
              />
            </Grid2>
          ))}
        </Grid2>
      </Container>
      <Footer />
    </>
  );
};

export default ListRecipePage;
