import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import HeaderIconList from "./HeaderIconList";
import { useNavigate } from "react-router-dom";

const MobileNavbar = () => {
  const navigate = useNavigate();

  const [drawOpen, setDrawOpenState] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawOpenState(open);
  };

  const handleClick = (url) => {
    navigate(url);
    setDrawOpenState(false);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleClick("/")}>
            <ListItemText primary={"首頁"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleClick("/products")}>
            <ListItemText primary={"全部商品"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleClick("/newproducts")}>
            <ListItemText primary={"最新商品"} />
          </ListItemButton>
        </ListItem>
      </List>
      {/* <Divider /> */}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "white", boxShadow: "0 0 5px rgb(0 0 0 / 20%)" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, color: "black" }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }} color={"black"}>
            CeShop
          </Typography>
          <HeaderIconList />
        </Toolbar>
      </AppBar>

      <Drawer anchor={"left"} open={drawOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </Box>
  );
};

export default MobileNavbar;
