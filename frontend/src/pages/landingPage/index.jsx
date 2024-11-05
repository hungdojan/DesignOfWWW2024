import React, { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Typography,
  TextField,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import "./landingPage.css";

import salmonImage from "../../assets/recipe/salmon.jpg";
import greekSaladImage from "../../assets/recipe/greek_salad.jpg";
import hotChocolateImage from "../../assets/recipe/hot_chocolate.jpg";
import FoodCard from "../../components/FoodCard";

<link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet"></link>

// hardcoded recipes for demo purposes
const recipes = [
  {
    id: 1,
    title: "Salmon Soup",
    image: salmonImage,
    alt: "Salmon Soup",
  },
  {
    id: 2,
    title: "Greek Salad",
    image: greekSaladImage,
    alt: "Greek Salad",
  },
  {
    id: 3,
    title: "Hot Chocolate",
    image: hotChocolateImage,
    alt: "Hot Chocolate",
  },
];

const LandingPage = () => {
  useEffect(() => {
    document.title = "Home Page";
  }, []);
  return (
    <div>
      <Header />
      <div className="background-image">
        {/* Search Bar (Outside Header) */}
        <div className="search-bar-container">
          <TextField
            variant="outlined"
            placeholder="Search Recipes..."
            fullWidth
            className="search-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className="search-icon">
                  <FaSearch />
                </InputAdornment>
              ),
              style: {
                borderRadius: "30px",
                padding: "0 20px",
                border: "3px solid var(--my-light-green)",
              },
            }}
          />
        </div>
        <div class="slogan">
          Eat <span class="highlight">Well</span>,<br/>
          Even on a <br/>
          <span class="highlight">Student's Schedule!</span>
        </div>
      </div>

      {/* Main Content */}
      <Container maxWidth="md">
        <Grid2 container spacing={2} className="box-grid">
          {recipes.map((recipe) => (
            <Grid2 item key={recipe.id}>
              <FoodCard
                img_src={recipe.image}
                alt={recipe.alt}
                title={recipe.title}
                editable={false}
                id={recipe.id}
              />
            </Grid2>
          ))}
        </Grid2>
      </Container>
      <Footer />
    </div>
  );
};

export default LandingPage;
