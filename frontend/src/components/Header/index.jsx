import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-tmp.png";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { IoIosArrowDropdown } from "react-icons/io";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // TODO: handle any logout, user auth, storing user info, etc.
  const handleLoginSuccess = (credentialResponse) => {
    var decoded = jwtDecode(credentialResponse.credential);
    // console.log(decoded);
    var name = decoded.given_name;
    setUserName(name);
  };

  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "50px", marginRight: "16px" }}
          onClick={() => {
            navigate("/");
          }}
        />
        <Typography
          variant="h4"
          component="a"
          href="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
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
          <MenuItem onClick={handleClose} className="nav-item">
            Find Recipes
          </MenuItem>
          <MenuItem onClick={() => navigate("/recipe/new")}>
            Add Recipe
          </MenuItem>
          <MenuItem onClick={handleClose}>My Recipes</MenuItem>
          <MenuItem onClick={handleClose}>Favorite Recipes</MenuItem>
        </Menu>
        <Button
          variant="text"
          className="nav-button"
          onClick={() => navigate("/shop_list")}
        >
          Shopping List
        </Button>
        {!userName ? (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        ) : (
          <Button variant="text" className="nav-button">
            Logout {userName}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
