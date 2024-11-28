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
  const [userID, setUserID] = useState('');
  const [recipes, setRecipes] = useState([]);

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

  const fetchAllRecipes = async () => {
    try {
      const resp = await axios.get('/api/recipes/');
      const userRecipes = resp.data.filter((recipe) => recipe.source.userID === userID);
      setRecipes(userRecipes);
    } catch (err) {
      alert('Error fetching recipes: ' + err);
    }
  };

  useEffect(() => {
    fetchUserId();
    document.title = "My Recipes";
  }, []);

  useEffect(() => {
    if (userID) {
      fetchAllRecipes();
    }
  }, [userID]);

  return (
    <>
      <Header />
      <Typography variant="h4" className="my-recipes">
        My Recipes <PiCookingPotFill class="recipe-icon" />
      </Typography>
      <Container maxWidth="md">
        <Grid2 container spacing={{ xs: 0, sm: 2 }} className="box-grid">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <Grid2 item key={recipe.ID}>
                <FoodCard
                  img_src={recipe.imageUrl}
                  alt={`Recipe ${recipe.name}`}
                  title={recipe.name}
                  editable={true}
                  id={recipe.ID}
                />
              </Grid2>
            ))
          ) : (
            <Typography className="empty">You didn't create any recipes.</Typography>
          )}
        </Grid2>
      </Container>
      <Footer />
    </>
  );
};

export default ListRecipePage;
