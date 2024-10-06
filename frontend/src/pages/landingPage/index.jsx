import React from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, Container, Card, CardContent, CardMedia, Link, Grid, InputAdornment} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import './landingPage.css';

const LandingPage = () => {
  return (
    <div>
      {/* Header */}
      <AppBar position="static" className="header">
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Food Tips
          </Typography>
          {/* Navigation Buttons */}
          <Button variant="text" className="button">
            Account
          </Button>
          <Button variant="text" className="button">
            Shopping List
          </Button>
        </Toolbar>
      </AppBar>

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
              borderRadius: '30px',
              padding: '0 20px',
            },
          }}
        />
      </Container>

      {/* Main Content */}
      <Container maxWidth="md">
        <Typography variant="h5" gutterBottom>
          Recommended Recipes
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {[1, 2, 3].map((_, index) => (
            <Grid item key={index}>
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
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" className="footer">
        <Typography variant="body1">Contact Us</Typography>
        <Link href="#" className="link">
          Email
        </Link>
        <Link href="#" className="link">
          Facebook
        </Link>
        <Link href="#" className="link">
          Instagram
        </Link>
      </Box>
    </div>
  );
};

export default LandingPage;
