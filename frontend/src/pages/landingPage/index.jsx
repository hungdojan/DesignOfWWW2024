import React from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Box, Container, Card, CardContent, CardMedia, Link, Grid } from '@mui/material';

const styles = {
  header: { backgroundColor: '#47BFFF' },
  searchBarContainer: { margin: '20px 0', textAlign: 'center' },
  searchBar: { backgroundColor: '#83D670', borderRadius: 4 },
  button: { color: '#B88262' },
  recommendedCard: { backgroundColor: '#68A062', color: '#fff', margin: 16, width: 220 },
  cardContent: { textAlign: 'center' },
  footer: { backgroundColor: '#715635', padding: 16, textAlign: 'center', color: '#fff' },
  link: { margin: '0 10px', color: '#B88262' },
};

const LandingPage = () => {
  return (
    <div>
      {/* Header */}
      <AppBar position="static" style={styles.header}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Food Tips
          </Typography>
          {/* Navigation Buttons */}
          <Button variant="text" style={styles.button}>
            Account
          </Button>
          <Button variant="text" style={styles.button}>
            Shopping List
          </Button>
        </Toolbar>
      </AppBar>

      {/* Search Bar (Outside Header) */}
      <Container style={styles.searchBarContainer}>
        <TextField
          variant="outlined"
          placeholder="Search Recipes..."
          size="medium"
          fullWidth
          style={styles.searchBar}
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
              <Card style={styles.recommendedCard}>
                {/* Placeholder for Recipe Image */}
                <CardMedia
                  component="img"
                  height="140"
                  image="https://via.placeholder.com/220x140"
                  alt={`Recipe ${index + 1}`}
                />
                <CardContent style={styles.cardContent}>
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
      <Box component="footer" style={styles.footer}>
        <Typography variant="body1">Contact Us</Typography>
        <Link href="#" style={styles.link}>
          Email
        </Link>
        <Link href="#" style={styles.link}>
          Facebook
        </Link>
        <Link href="#" style={styles.link}>
          Instagram
        </Link>
      </Box>
    </div>
  );
};

export default LandingPage;
