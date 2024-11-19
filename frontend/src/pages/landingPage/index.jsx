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

<link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet"></link>

const LandingPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterRecipes = (query) => {
    if (!query.trim()) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  const fetchPopularRecipes = () => {
    axios
      .get("/api/recipes/")
      .then((resp) => {
        Promise.all(
          resp.data.slice(0, 3).map((recipe) =>
            axios
              .get(`/api/recipes/${recipe.ID}/image/`, { responseType: "blob" })
              .then((imageResp) => {
                const imageUrl = URL.createObjectURL(imageResp.data);
                return { ...recipe, imageUrl };
              })
              .catch((err) => {
                console.error("Error fetching image for recipe:", recipe.ID);
                return { ...recipe, imageUrl: "https://via.placeholder.com/220x140" };
              })
          )
        ).then((recipesWithImages) => {
          setRecipes(recipesWithImages);
        });
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
            {recipes.map((recipe) => (
              <Grid2 item key={recipe.ID} className="recipe-item">
                <FoodCard
                  img_src={recipe.imageUrl}
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
