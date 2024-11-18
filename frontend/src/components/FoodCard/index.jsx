import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import axios from "axios";
import "./FoodCard.css";
import { MdEdit } from "react-icons/md";
import { MdStar } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const FoodCard = ({ img_src, alt, title, editable, id }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // TODO for current user
  const uid = "c0c07782-1349-4c4e-bb82-f9e9a7b558cf";
  const navigate = useNavigate();

  const checkIfFavorite = async () => {
    try {
      const response = await axios.get(`/api/favorites/favorite_recipes/${uid}`);
      setIsFavorite(response.data.some(recipe => recipe.ID === id));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`/api/favorites/users/${uid}/delete/${id}`);
        setIsFavorite(false);
      } else {
        await axios.post(
          `/api/favorites/favorite_recipes/${uid}`,
          { recipe_id: id }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      alert("Error: Failed to toggle favorite status.");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    checkIfFavorite();
  }, [id]);
  return (
    <Card className="food-card">
      <CardMedia
        component="img"
        height="140"
        image={img_src}
        alt={alt}
        onClick={() => navigate(`/recipe/view/${id}`)}
      />
      <CardContent className="card-content">
        <Typography
          variant="h6"
          component="a"
          href={`/recipe/view/${id}`}
          className="recipe-title"
        >
          {title}
        </Typography>
        {editable && (
          <Button className="edit-recipe-button">
            <MdEdit />
          </Button>
        )}
        {!editable && (
          <Button
          className={`fav-recipe-button ${isFavorite ? 'favorite' : ''}`}
            onClick={toggleFavorite}
          >
            <MdStar />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodCard;
