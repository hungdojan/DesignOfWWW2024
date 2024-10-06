import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { IoIosArrowDropdown } from 'react-icons/io';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Food Tips
        </Typography>
        <Button 
          variant="text"
          className="nav-button" 
          onClick={handleClick}
          endIcon={<IoIosArrowDropdown className="dropdown-icon" />}
        >
          Recipes 
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} className="nav-menu" onClose={handleClose} >
          <MenuItem onClick={handleClose} className="nav-item">Find Recipes</MenuItem>
          <MenuItem onClick={handleClose}>Add Recipe</MenuItem>
          <MenuItem onClick={handleClose}>My Recipes</MenuItem>
          <MenuItem onClick={handleClose}>Favourite Recipes</MenuItem>
        </Menu>
        <Button variant="text" className="nav-button">
          Shopping List
        </Button>
        <Button variant="text" className="nav-button">
          Log In
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;