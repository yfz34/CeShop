import { styled } from "@mui/material";
import React from "react";

const Container = styled("div")(({ theme }) => ({
  margin: "0 auto",
  // padding: "5px",
  height: "auto",

  [theme.breakpoints.up("xl")]: {
    maxWidth: 1400,
  },

  [theme.breakpoints.down("xl")]: {
    maxWidth: 1140,
  },

  [theme.breakpoints.down("lg")]: {
    maxWidth: "94%",
  },

  [theme.breakpoints.down("md")]: {
    maxWidth: "94%",
  },

  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const GlobalContainer = ({ children }) => {
  return <Container>{children}</Container>;
};

export default GlobalContainer;
