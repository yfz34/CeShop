import { Button, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import ContainerTitle from "../components/admin/ContainerTitle";
import ProductTypeCreate from "../components/admin/ProductTypeCreate";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const AdminProductTypeCreatePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <IconButton
            aria-label="返回"
            onClick={() => navigate("/backstage/producttype")}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h4">新增商品類型</Typography>
        </Box>
      </Box>

      <ProductTypeCreate />
    </div>
  );
};

export default AdminProductTypeCreatePage;
