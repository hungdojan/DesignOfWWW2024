import React from "react";
import { Box, Typography, Link } from "@mui/material";
import "./Footer.css";

import logo from "../../assets/logo-tmp.png";

const Footer = () => {
  return (
    <>
      <Box component="footer" className="footer">
        <Box className="footer-image">
          <img src={logo} alt="Footer" />
        </Box>
        <Box className="contact">
          <Typography className="title">Contact Us</Typography>
          <Link href="#" className="link">
            Email
          </Link>
          <br />
          <Link href="#" className="link">
            Facebook
          </Link>
          <br />
          <Link href="#" className="link">
            Instagram
          </Link>
        </Box>
      </Box>
      <div className="design">
        Designed by Food Tips Team.
      </div>
    </>
  );
};

export default Footer;
