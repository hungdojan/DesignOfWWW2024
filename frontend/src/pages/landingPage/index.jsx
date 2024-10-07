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

const LandingPage = () => {
  useEffect(() => {
    document.title = "Home Page";
  }, []);
  return (
    <div>
      <Header />
      {/* Search Bar (Outside Header) */}
      <Container className="search-bar-container">
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
            },
          }}
        />
      </Container>

      {/* Main Content */}
      <Container maxWidth="md">
        <Typography variant="h5" gutterBottom>
          Recommended Recipes
        </Typography>
        <Grid2 container spacing={2} className="box-grid">
          {[1, 2, 3].map((_, index) => (
            <Grid2 item key={index}>
              <Card className="recommended-card">
                {/* Placeholder for Recipe Image */}
                <CardMedia
                  component="img"
                  height="140"
                  image="https://via.placeholder.com/220x140"
                  alt={`Recipe ${index + 1}`}
                />
                <CardContent className="card-content">
                  {/* Recipe Title */}
                  <Typography variant="h6" component="div">
                    Recipe {index + 1}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
      <Footer />
    </div>
  );
};

export default LandingPage;
