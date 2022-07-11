import { useState } from "react";

import {
  Badge,
  Box,
  Button,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import useCart from "../../hooks/useCart";

const HeaderToolContainer = styled(Box)(() => ({
  // position: "absolute",
  // top: 0,
  // right: 0,
  // padding: "10px",
}));

const SearchInput = styled("input")(() => ({
  fontSize: "15px",
  flex: 1,
  marginRight: "5px",
}));

const createImageUrl = (name, pixel) =>
  `/api/images/show?name=${name}&pixel=${pixel}`;

const HeaderIconList = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { cart } = useCart();
  const logout = useLogout();

  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);

  const [searchInput, setSearchInput] = useState("");

  const userOpen = Boolean(userAnchorEl);
  const cartOpen = Boolean(cartAnchorEl);
  const searchOpen = Boolean(searchAnchorEl);

  const handleUserClick = (event) => {
    setUserAnchorEl(event.currentTarget);
  };
  const handleCartClick = (event) => {
    setCartAnchorEl(event.currentTarget);
  };
  const handleSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchorEl(null);
  };
  const handleCartClose = () => {
    setCartAnchorEl(null);
  };
  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const handleUserProfile = () => {
    setUserAnchorEl(null);
    navigate("/user/profile");
  };

  const handleUserOrder = () => {
    setUserAnchorEl(null);
    navigate("/user/order");
  };

  const handleUserRegister = () => {
    setUserAnchorEl(null);
    navigate("/account/register");
  };

  const handleUserLogin = () => {
    setUserAnchorEl(null);
    navigate("/account/login");
  };

  const handleUserLogout = async () => {
    setUserAnchorEl(null);
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
      console.log("登出失敗");
    }
  };

  const handleMiniCartClick = (id) => {
    setCartAnchorEl(null);
    navigate("/product/" + id);
  };

  const handleToCartPageClick = () => {
    navigate("/user/cart");
    setCartAnchorEl(null);
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  const handleSearchChange = () => {
    navigate("/keyword/" + searchInput);
    setSearchAnchorEl(null);
  };

  const test = () => {
    console.log(auth);
    console.log(document.cookie);
    console.log(cart);
  };

  return (
    <Box>
      <HeaderToolContainer>
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="user"
            size="large"
            aria-controls={userOpen ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={userOpen ? "true" : undefined}
            onClick={handleUserClick}
          >
            <PersonIcon />
          </IconButton>
          <IconButton
            aria-label="cart"
            size="large"
            aria-controls={userOpen ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={userOpen ? "true" : undefined}
            onClick={handleCartClick}
          >
            <Badge badgeContent={cart.totalCount} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton
            aria-label="search"
            size="large"
            aria-controls={userOpen ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={userOpen ? "true" : undefined}
            onClick={handleSearchClick}
          >
            <SearchIcon />
          </IconButton>
        </Stack>
      </HeaderToolContainer>

      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={userAnchorEl}
        open={userOpen}
        onClose={handleUserClose}
        TransitionComponent={Fade}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* <MenuItem onClick={test}>TEST</MenuItem> */}
        {auth?.accessToken ? (
          <Box>
            <MenuItem onClick={handleUserProfile}>個人資料</MenuItem>
            <MenuItem onClick={handleUserOrder}>我的訂單</MenuItem>
            <MenuItem onClick={handleUserLogout}>登出</MenuItem>
          </Box>
        ) : (
          <Box>
            <MenuItem onClick={handleUserLogin}>會員登入</MenuItem>
            <MenuItem onClick={handleUserRegister}>註冊會員</MenuItem>
          </Box>
        )}
      </Menu>

      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={cartAnchorEl}
        open={cartOpen}
        onClose={handleCartClose}
        TransitionComponent={Fade}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ width: "300px", padding: "10px" }}>
          {auth.hasOwnProperty("accessToken") ? (
            <Box>
              {cart?.carts?.map((item, index) => (
                <Box
                  mb={2}
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMiniCartClick(item.goodsId)}
                >
                  <img
                    src={createImageUrl(item.picture, 50)}
                    alt=""
                    width="50px"
                  />
                  <Box pl={1}>
                    <Typography variant="p">{item.name}</Typography>
                  </Box>
                  <Box pl={1}>
                    $<Typography variant="p">{item.price}</Typography>
                  </Box>
                </Box>
              ))}

              {cart?.carts?.length === 0 ? (
                <Box sx={{ textAlign: "center", padding: "10px 0" }}>
                  <Typography variant="p">目前沒有商品</Typography>
                </Box>
              ) : null}

              <Button
                fullWidth
                variant="contained"
                onClick={() => handleToCartPageClick()}
              >
                查看我的購物車
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", padding: "10px 0" }}>
              <Typography variant="p">請先登入</Typography>
            </Box>
          )}
        </Box>
      </Menu>

      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={searchAnchorEl}
        open={searchOpen}
        onClose={handleSearchClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ display: "flex", padding: "10px" }}>
          <SearchInput
            onChange={(e) => handleSearchInputChange(e.target.value)}
          />
          <Button variant="contained" onClick={() => handleSearchChange()}>
            搜尋
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default HeaderIconList;
