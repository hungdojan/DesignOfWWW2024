import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
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
import "./recipePage.css";
import { PiCookingPotFill } from "react-icons/pi";
import { MdEdit } from "react-icons/md";

const RecipePage = () => {
  const { id } = useParams();
  useEffect(() => {
    document.title = "Recipe";
  }, []);
  return <p>{id}</p>;
};

export default RecipePage;
