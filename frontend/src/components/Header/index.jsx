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

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [scrollingDown, setScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if the user is scrolling down or up
      if (currentScrollY > lastScrollY) {
        setScrollingDown(true);  // Scrolling down
      } else {
        setScrollingDown(false); // Scrolling up
      }

      setLastScrollY(currentScrollY); // Update last scroll position
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

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
    <AppBar position="sticky" className="header">
      <Toolbar sx={{
          paddingTop: isMobile ? (scrollingDown ? '16px' : '0x') : '0px',
        }}>
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
