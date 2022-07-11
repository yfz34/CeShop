import React from "react";

import { Box, Link, styled } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import GitHubIcon from "@mui/icons-material/GitHub";
import RssFeedIcon from "@mui/icons-material/RssFeed";

import GlobalContainer from "./GlobalContainer";

const Container = styled(Box)({
  display: "flex",
  borderTop: "solid black 2px",
});

const Left = styled(Box)({
  flex: 1,
  // display: "flex",
  // flexDirection: "column",
  padding: 20,
});

const Logo = styled("h1")({});

const Description = styled("p")({
  margin: "20px 0px",
});

const SocialContainer = styled(Box)({
  display: "flex",
});

const SocialIcon = styled(Box)((props) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  color: "white",
  backgroundColor: `#${props.color}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 20,
}));

const Right = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: 20,
});

const Title = styled("h3")({
  marginBottom: 30,
});

const List = styled("ul")({
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "flex",
  // flexWrap: "wrap",
  flexDirection: "column",
});

const ListItem = styled("li")({
  width: "50%",
  marginBottom: 10,
});

const Footer = () => {
  return (
    <GlobalContainer>
      <Container>
        <Left>
          <Logo>CeShop</Logo>
          <Description>此網站為個人作品，非商業用途</Description>
          <SocialContainer>
            <Link
              href="https://github.com/yfz34/CeShop"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon color="000" sx={{ cursor: "pointer" }}>
                <GitHubIcon />
              </SocialIcon>
            </Link>
          </SocialContainer>
        </Left>
        <Right>
          <Title>相關連接</Title>
          <List>
            <ListItem>
              <Link component={RouterLink} to={"/"} underline="none">
                首頁
              </Link>
            </ListItem>
            <ListItem>
              <Link component={RouterLink} to={"/products"} underline="none">
                全部商品
              </Link>
            </ListItem>
            <ListItem>
              <Link component={RouterLink} to={"/newproducts"} underline="none">
                最新商品
              </Link>
            </ListItem>
          </List>
        </Right>
      </Container>
    </GlobalContainer>
  );
};

export default Footer;
