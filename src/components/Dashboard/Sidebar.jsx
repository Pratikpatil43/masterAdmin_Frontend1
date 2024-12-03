import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  useMediaQuery,
  Divider,
  Typography,
} from "@mui/material";
import { Add, List as ListIcon, Menu as MenuIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const drawerWidth = 240;
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Mobile Menu Icon */}
      {isMobile && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1201,
            padding: "10px",
            fontSize: "2rem",
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon sx={{ fontSize: "2.5rem" }} />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
            borderRight: "1px solid #e0e0e0", // Light border for a clean look
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? open : true}
        onClose={toggleDrawer}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", padding: "10px" }}>
          {/* Section: HOD */}
          <Typography variant="h6" sx={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
            HOD Management
          </Typography>
          <List>
            <ListItem
              button
              component={Link}
              to="/dashboard/add-hod"
              onClick={handleLinkClick}
            >
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add HOD" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/dashboard/fetch-hod"
              onClick={handleLinkClick}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Fetch HOD" />
            </ListItem>
          </List>
          <Divider sx={{ margin: "10px 0" }} />

          {/* Section: Faculty */}
          <Typography variant="h6" sx={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
            Faculty Management
          </Typography>
          <List>
            <ListItem
              button
              component={Link}
              to="/dashboard/add-faculty"
              onClick={handleLinkClick}
            >
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add Faculty" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/dashboard/fetch-faculty"
              onClick={handleLinkClick}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Fetch Faculty" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
