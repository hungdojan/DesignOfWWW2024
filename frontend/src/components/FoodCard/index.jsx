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
import { useAuth } from '../authContext';

const FoodCard = ({ alt, title, editable, id }) => {
  const [userID, setUserID] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const { loggedIn, loginUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/recipe/edit');
  };

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

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}/image/`);
        if (response.data?.images_ids?.length > 0) {
          const imageId = response.data.images_ids[0];
          const imageResponse = await axios.get(`/api/images/${imageId}`, { responseType: "blob" });
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setImgSrc(imageUrl);
        } else {
          console.log("No image IDs found in the response.");
        }
      } catch (error) {
        console.error("Error fetching image", error);
      }
    };

    fetchImage();
  }, [id]);

  useEffect(() => {
    if (userID && id) {
      const checkIfFavorite = async () => {
        try {
          const response = await axios.get(`/api/favorites/favorite_recipes/${userID}`);
          setIsFavorite(response.data.some(recipe => recipe.ID === id));
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };
      
      checkIfFavorite();
    }
  }, [id, userID]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`/api/favorites/users/${userID}/delete/${id}`);
        setIsFavorite(false);
      } else {
        await axios.post(
          `/api/favorites/favorite_recipes/${userID}`,
          { recipe_id: id }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      alert("Error: Failed to toggle favorite status.");
      console.error("Error:", error);
    }
  };

  return (
    <Card className="food-card">
      <CardMedia
        component="img"
        height="140"
        image={imgSrc || "https://via.placeholder.com/220x140"}
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
          <Button
          className="edit-recipe-button"
            onClick={handleEditClick}>
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