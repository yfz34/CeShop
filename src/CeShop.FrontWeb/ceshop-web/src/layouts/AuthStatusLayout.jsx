import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const AuthStatusLayout = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default AuthStatusLayout;
