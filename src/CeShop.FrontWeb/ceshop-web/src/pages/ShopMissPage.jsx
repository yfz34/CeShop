import { Box, styled, Typography } from "@mui/material";
import React from "react";

const Container = styled(Box)({
  width: "100%",
  height: "100%",

  padding: "20px 0",
  textAlign: "center",
});

const ShopMissPage = () => {
  return (
    <Container>
      <Typography variant="h4">Page No Found</Typography>
    </Container>
  );
};

export default ShopMissPage;
