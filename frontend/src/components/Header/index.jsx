import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from '../authContext'; 

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery("(max-width: 600px)");
  
  const navigate = useNavigate();
  const { isAuthenticated, loginUser, logoutUser } = useAuth();

  const handleNavigation = (route) => {

    if (isAuthenticated) {
      navigate(route);
    } else {
      alert('You must be logged in to access this page!');
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
    
  const handleLoginSuccess = (credentialResponse) => {
    var decoded = jwtDecode(credentialResponse.credential);
    loginUser(decoded.email, decoded.name, decoded.email);
  };

  const handleLogout = () => {
    logoutUser()
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
              <MenuItem onClick={() => handleNavigation("/recipe/new")}>
                Add Recipe
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("/recipe/my_list")}>
                My Recipes
              </MenuItem>
              <MenuItem onClick={() => handleNavigation("/recipe/favorite")}>
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
                Logout
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
            <MenuItem onClick={() => handleNavigation("/recipe/new")}>
              Add Recipe
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/recipe/my_list")}>
              My Recipes
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/recipe/favorite")}>
              Favorite Recipes
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/shop_list")}>
              Shopping List
            </MenuItem>

            {!isAuthenticated ? (
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
                <Button variant="text" onClick={() => handleLogout()} className="nav-button">
                  Logout
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
