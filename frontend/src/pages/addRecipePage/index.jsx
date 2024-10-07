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
        My Recipes <PiCookingPotFill class="recipe-icon" />
      </Typography>
      {/* Main Content */}
      <Container maxWidth="md">
        <Grid2 container spacing={2} className="box-grid">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Grid2 item key={index}>
              <Card className="recommended-card">
                {/* Placeholder for Recipe Image */}
                <CardMedia
                  component="img"
                  height="140vh"
                  width="100%"
                  image="https://via.placeholder.com/220x140"
                  alt={`Recipe ${index + 1}`}
                />
                <CardContent className="card-content">
                  {/* Recipe Title */}
                  <Typography variant="h6" component="div">
                    Recipe {index + 1}
                    <Button className="edit-button" variant="contained">
                      <MdEdit />
                    </Button>
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
      <Footer />
    </>
  );
};

export default AddRecipePage;
