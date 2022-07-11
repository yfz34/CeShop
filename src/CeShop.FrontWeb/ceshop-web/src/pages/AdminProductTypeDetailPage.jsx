import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ProductTypeDetail from "../components/admin/ProductTypeDetail";

const AdminProductTypeDetailPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <IconButton
            aria-label="返回"
            onClick={() => navigate("/backstage/producttype")}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h4">商品類別資訊</Typography>
        </Box>
      </Box>
      <ProductTypeDetail />
    </Box>
  );
};

export default AdminProductTypeDetailPage;
