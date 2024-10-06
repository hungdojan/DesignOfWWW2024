import React, { useState } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { Typography, TextField, Box, Container, Card, CardContent, CardMedia, Link, Grid, Button} from '@mui/material';
import './recipePage.css'
import { PiCookingPotFill } from "react-icons/pi";
import { MdEdit } from "react-icons/md";

const RecipePage = () => {
  return (
    <>
      <Header />
      <Typography variant="h4" className='my-recipes'>
        My Recipes <PiCookingPotFill class="recipe-icon"/>
      </Typography>
      {/* Main Content */}
      <Container maxWidth="md">
        <Grid container spacing={2} className="box-grid">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Grid item key={index}>
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
                    <Button
                      className='edit-button'
                      variant="contained"
                    >
                      <MdEdit />
                    </Button>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default RecipePage;
