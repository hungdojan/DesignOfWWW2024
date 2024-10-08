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
import "./addRecipePage.css";
import { PiCookingPotFill } from "react-icons/pi";
import { MdEdit } from "react-icons/md";

const AddRecipePage = () => {
  useEffect(() => {
    document.title = "New Recipe";
  }, []);
  return (
    <>
      <Header />
      <Typography variant="h4" className="my-recipes">
        New Recipes <PiCookingPotFill class="recipe-icon" />
      </Typography>
      TODO:
      <Footer />
    </>
  );
};

export default AddRecipePage;
