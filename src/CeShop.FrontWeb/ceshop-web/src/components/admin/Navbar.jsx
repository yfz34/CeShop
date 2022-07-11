import React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReorderIcon from "@mui/icons-material/Reorder";

import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "首頁統計",
    children: [
      {
        id: "首頁",
        icon: <HomeIcon />,
        url: "/backstage",
      },
    ],
  },
  {
    id: "使用者設定",
    children: [
      {
        id: "顧客管理",
        icon: <PeopleIcon />,
        url: "/backstage/user",
      },
    ],
  },
  {
    id: "商品設定",
    children: [
      {
        id: "商品分類管理",
        icon: <CategoryIcon />,
        url: "/backstage/category",
      },
      {
        id: "商品類別管理",
        icon: <MergeTypeIcon />,
        url: "/backstage/producttype",
      },
      {
        id: "商品管理",
        icon: <InventoryIcon />,
        url: "/backstage/product",
      },
    ],
  },
  {
    id: "訂單設定",
    children: [
      {
        id: "訂單管理",
        icon: <ReorderIcon />,
        url: "/backstage/order",
      },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

const Navbar = (props) => {
  const { ...other } = props;
  const [selectedIndex, setSelectedIndex] = React.useState("首頁");
  const navigate = useNavigate();

  const handleListItemClick = (event, index, url) => {
    setSelectedIndex(index);
    navigate(url);
  };

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          後臺管理
        </ListItem>

        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, url }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  sx={item}
                  selected={selectedIndex === childId}
                  onClick={(event) => handleListItemClick(event, childId, url)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

export default Navbar;
