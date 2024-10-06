import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
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
  );
};

export default Footer;