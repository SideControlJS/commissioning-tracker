import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Lighting Commissioning Tracker
        </Typography>
        <Button color="inherit" component={Link} to="/upload">Upload</Button>
        <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
        <Button color="inherit" component={Link} to="/issues">Issue Tracker</Button>
        <Button color="inherit" component={Link} to="/reports">Reports</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
