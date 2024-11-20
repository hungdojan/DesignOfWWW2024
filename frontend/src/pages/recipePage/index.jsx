import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import "./recipePage.css";

const RecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userID, setUserID] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchLogInStatus = async () => {
      try {
        const response = await axios.get("/api/auth/status");
        setLoggedIn(response.data.authenticated);
      } catch (error) {
        console.error("Error fetching login status:", error.response || error.message);
      }
    };
  
    fetchLogInStatus();
  }, []);

  useEffect(() => {
    if (loggedIn) {
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
      fetchUserId();
    }
  }, [loggedIn]);

  const handleEditClick = () => {
    navigate('/recipe/edit');
  };

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (err) {
      setError("Failed to fetch recipe.");
    }
  };

  const handleDelete = async () => {
    try {
      if (recipe.imageUrl) {
        await axios.delete(`/api/recipes/${userID}/image/${recipe.ID}/`);
      }
      await axios.delete(`/api/recipes/${id}`);
      navigate("/recipe/my_list");
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    } finally {
      setDialogOpen(false);
    }
  };

  useEffect(() => {
    document.title = "Recipe";
    fetchRecipe();
  }, [id]);

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
            <div className="recipe-info">
              <Typography>Difficulty: <span className="highlight">{recipe.difficulty}</span></Typography>
              <Typography>Expected Time: <span className="highlight">{recipe.expectedTime} minutes</span></Typography>
            </div>
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
            {recipe.instructions
              .split("\n")
              .map(instruction => instruction.trim())
              .filter(instruction => instruction)
              .map((instruction, index) => (
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
                onClick={handleEditClick}
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
                onClick={() => setDialogOpen(true)}
              >
                Delete Recipe
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          className: "dialog-window",
        }}
      >
        <DialogTitle id="alert-dialog-title" className="dialog-title">
          {"Confirm Recipe Deletion"}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this recipe? <br /> This action cannot be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            onClick={() => setDialogOpen(false)}
            className="cancel-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="delete-button"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </Box>
  );
};

export default RecipePage;
