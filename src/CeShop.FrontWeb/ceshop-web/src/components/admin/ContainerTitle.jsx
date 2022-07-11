import { Box, Typography } from "@mui/material";
import React from "react";

const ContainerTitle = ({ title }) => {
  return (
    <Box mb={5}>
      <Typography component={"h1"} variant={"h4"}>
        {title}
      </Typography>
    </Box>
  );
};

export default ContainerTitle;
