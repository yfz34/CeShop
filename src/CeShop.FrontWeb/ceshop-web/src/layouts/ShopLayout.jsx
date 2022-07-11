import { Box, styled, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../components/shop/Footer";
import Navbar from "../components/shop/Navbar";
import MobileNavbar from "../components/shop/MobileNavbar";
import ShopThemeProvider from "../contexts/ShopThemeProvider";

const Container = styled(Box)(({ theme }) => ({
  // margin: "0 auto",
  // [theme.breakpoints.up("xl")]: {
  //   maxWidth: 1400,
  // },
  // [theme.breakpoints.down("xl")]: {
  //   maxWidth: 1140,
  // },
  // [theme.breakpoints.down("lg")]: {
  //   maxWidth: "94%",
  // },
  // [theme.breakpoints.down("md")]: {
  //   maxWidth: "94%",
  // },
  // [theme.breakpoints.down("sm")]: {
  //   maxWidth: "100%",
  // },
  backgroundColor: "#e5e5e5",
  position: "relative",
  minHeight: "100vh",
}));

const NavContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  right: 0,
  left: 0,
  zIndex: 5,
}));

const PageContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "100vh",

  paddingTop: "185px",
  paddingBottom: "200px",

  [theme.breakpoints.down("md")]: {
    paddingTop: "64px",
  },

  [theme.breakpoints.down("sm")]: {
    paddingTop: "56px",
  },
}));

const FooterContainer = styled(Box)({
  position: "absolute",
  bottom: 0,
  width: "100%",
  height: "200px",
  backgroundColor: "white",
});

const ShopLayout = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <ShopThemeProvider>
      <Container>
        <NavContainer>{isMdUp ? <Navbar /> : <MobileNavbar />}</NavContainer>

        <PageContainer>
          <Outlet />
        </PageContainer>

        <FooterContainer>
          <Footer />
        </FooterContainer>
      </Container>
    </ShopThemeProvider>
  );
};

export default ShopLayout;
