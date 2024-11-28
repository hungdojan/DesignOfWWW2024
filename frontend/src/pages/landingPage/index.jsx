import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FoodCard from "../../components/FoodCard";
import {
  Typography,
  TextField,
  Container,
  Grid2,
  InputAdornment,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import "./landingPage.css";

<link
  href="https://fonts.googleapis.com/css2?family=Lobster&display=swap"
  rel="stylesheet"
></link>;

// code snippet origin: https://stackoverflow.com/a/2450976
const shuffle = (array) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};

const LandingPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterRecipes = (query) => {
    if (!query.trim()) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredRecipes(filtered);
    }
  };

  const fetchPopularRecipes = () => {
    axios
      .get("/api/recipes/")
      .then((resp) => {
        setRecipes(resp.data);
        shuffle(resp.data);
        setPopularRecipes(resp.data.slice(0, 12));
      })
      .catch((err) => alert("Error fetching recipes: " + err));
  };

  useEffect(() => {
    document.title = "Home Page";
    fetchPopularRecipes();
  }, []);

  useEffect(() => {
    filterRecipes(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchPerformed(true);
  };

  return (
    <div>
      <Header />
      <div className="background-image">
        <div className="search-bar-container">
          <TextField
            variant="outlined"
            placeholder="Search Recipes..."
            fullWidth
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="search-input"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className="search-icon">
                  <FaSearch />
                </InputAdornment>
              ),
              style: {
                borderRadius: "30px",
                border: "3px solid var(--my-light-green)",
              },
            }}
          />
        </div>
        {!searchPerformed && (
          <div className="slogan">
            Eat <span className="highlight">Well</span>,<br />
            Even on a <br />
            <span className="highlight">Student's Schedule!</span>
          </div>
        )}
      </div>

      {!searchPerformed && (
        <Container maxWidth="md">
          <Grid2 container spacing={{ xs: 0, sm: 2 }} className="box-grid">
            {popularRecipes.map((recipe) => (
              <Grid2 item key={recipe.ID} className="recipe-item">
                <FoodCard
                  alt={`Recipe ${recipe.name}`}
                  title={recipe.name}
                  editable={false}
                  id={recipe.ID}
                />
              </Grid2>
            ))}
          </Grid2>
        </Container>
      )}

      {searchPerformed && (
        <Container maxWidth="md">
          <Grid2 container spacing={{ xs: 0, sm: 2 }} className="box-grid">
            {filteredRecipes.length === 0 ? (
              <Container maxWidth="md" className="container">
                <Typography className="empty">No recipe found.</Typography>
              </Container>
            ) : (
              filteredRecipes.map((recipe) => (
                <Grid2 item key={recipe.ID} className="recipe-item">
                  <FoodCard
                    img_src={recipe.imageUrl}
                    alt={`Recipe ${recipe.name}`}
                    title={recipe.name}
                    editable={false}
                    id={recipe.ID}
                  />
                </Grid2>
              ))
            )}
          </Grid2>
        </Container>
      )}
      <Footer />
    </div>
  );
};

export default LandingPage;
