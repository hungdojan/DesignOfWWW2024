import React, { useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Button,
} from "@mui/material";
import "./listRecipePage.css";
import { PiCookingPotFill } from "react-icons/pi";
import { MdEdit } from "react-icons/md";
import FoodCard from "../../components/FoodCard";

const ListRecipePage = () => {
  useEffect(() => {
    document.title = "My Recipes";
  }, []);
  return (
    <>
      <Header />
      <Typography variant="h4" className="my-recipes">
        My Recipes <PiCookingPotFill class="recipe-icon" />
      </Typography>
      {/* Main Content */}
      <Container maxWidth="md">
        <Grid2 container spacing={2} className="box-grid">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Grid2 item key={index}>
              <FoodCard
                img_src={"https://via.placeholder.com/220x140"}
                alt={`Recipe ${index + 1}`}
                title={`Recipe ${index + 1}`}
                editable={true}
                id={index}
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
