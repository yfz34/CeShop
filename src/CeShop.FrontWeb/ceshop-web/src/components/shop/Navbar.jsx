import React from "react";
import { Link } from "react-router-dom";

import { Box, Stack, styled, Typography } from "@mui/material";

import Logo from "../../assets/logo.jpg";

import { menu } from "../../data/data";
import HeaderIconList from "./HeaderIconList";
import GlobalContainer from "./GlobalContainer";

const Container = styled("div")({
  width: "100%",
  // boxShadow: "0 0 5px rgb(0 0 0 / 20%)",
  zIndex: 2,
  backgroundColor: "white",
});

const NavContainer = styled(Box)(() => ({
  width: "100%",
  padding: "10px 20px",
  textAlign: "center",
  position: "relative",
  borderBottom: "solid #E2E2E2 2px",
}));

const LogoContainer = styled("img")(() => ({
  width: "auto",
}));

const IconToolLayout = styled(Box)({
  position: "absolute",
  top: 0,
  right: 0,
  padding: "10px",
});

const Navbar = () => {
  return (
    <Container>
      <GlobalContainer>
        <NavContainer>
          <Box>
            <Link to="/">
              <LogoContainer src={Logo} alt="" />
            </Link>
          </Box>

          <IconToolLayout>
            <HeaderIconList />
          </IconToolLayout>
        </NavContainer>
      </GlobalContainer>

      <Box fullWidth>
        <Stack direction="row" spacing={4} justifyContent="center">
          {menu.map((item) => (
            <Box
              component={Link}
              to={item.url}
              key={item.id}
              sx={{
                color: "gray",
                fontWeight: "bold",
                textDecoration: "none",
                padding: "12px",
                ":hover": { color: "white", backgroundColor: "#1976d2" },
              }}
            >
              <Typography variant="p">{item.title}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default Navbar;
