import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ProductDetail from "../components/admin/ProductDetail";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const AdminProductDetailPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <IconButton
            aria-label="返回"
            onClick={() => navigate("/backstage/product")}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h4">商品資訊</Typography>
        </Box>
      </Box>
      <ProductDetail />
    </Box>
  );
};

export default AdminProductDetailPage;
