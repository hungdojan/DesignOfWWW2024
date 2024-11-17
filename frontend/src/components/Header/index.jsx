import React, { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import logo from "../../assets/logo-tmp.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { IoIosArrowDropdown } from "react-icons/io";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./Header.css";
import axios from 'axios';
import useAuthStatus from '../useAuthStatus'; 

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
  const isMobile = useMediaQuery("(max-width: 600px)");
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStatus();

  const handleNavigation = (route) => {

    if (isAuthenticated) {
      navigate(route);
    } else {
      alert('Log in you daft twat.');
      // TODO: redirect to login page?
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loginUser = async (username, name, email) => {
    const payload = {
      username: username,
      name: name,
      email: email,
    };

      axios.post('/api/auth/login', payload)
      .catch(err => alert("Error"))

    // handleNavigation("/")
    // TODO: refresh page?
  };

  // TODO: handle any logout, user auth, storing user info, etc.
  const handleLoginSuccess = (credentialResponse) => {
    var decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);
    loginUser(decoded.email, decoded.name, decoded.email);
  };

  const handleLogout = () => {
    const response = axios.get('/api/auth/logout');
    handleNavigation("/")
  }

  return (
    <AppBar position="sticky" className="header">
      <Toolbar>
        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <Typography
              variant="h4"
              component="a"
              href="/"
              className="header-name"
            >
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
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              className="nav-menu"
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate("/recipe/new")}>
                Add Recipe
              </MenuItem>
              <MenuItem onClick={() => navigate("/recipe/my_list")}>
                My Recipes
              </MenuItem>
              <MenuItem onClick={() => navigate("/recipe/favorite")}>
                Favorite Recipes
              </MenuItem>
            </Menu>
            <Button
              variant="text"
              className="nav-button"
              onClick={() => handleNavigation("/shop_list")}
            >
              Shopping List
            </Button>
            {!isAuthenticated ? (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            ) : (
              <Button variant="text" onClick={() => handleLogout()} className="nav-button">
                Logout {userName}
              </Button>
            )}
        </>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="mobile-nav">
          <img
          src={logo}
          alt="Logo"
          className="logo-img"
          onClick={() => {
            navigate("/");
          }}
          />
          <IconButton onClick={handleClick} className="menu-button">
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => navigate("/recipe/new")}>
              Add Recipe
            </MenuItem>
            <MenuItem onClick={() => navigate("/recipe/my_list")}>
              My Recipes
            </MenuItem>
            <MenuItem onClick={() => navigate("/recipe/favorite")}>
              Favorite Recipes
            </MenuItem>
            <MenuItem onClick={() => navigate("/shop_list")}>
              Shopping List
            </MenuItem>

            {!userName ? (
              <MenuItem>
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </MenuItem>
            ) : (
              <MenuItem>
                <Button variant="text" className="nav-button" onClick={() => setUserName(null)}>
                  Log Out {userName}
                </Button>
              </MenuItem>
            )}
          </Menu>
        </div>
      )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
