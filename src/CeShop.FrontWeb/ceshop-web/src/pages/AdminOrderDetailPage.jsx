import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import OrderDetail from "../components/admin/OrderDetail";

const AdminOrderDetailPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <IconButton
            aria-label="返回"
            onClick={() => navigate("/backstage/order")}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h4">訂單資訊</Typography>
        </Box>
      </Box>
      <OrderDetail />
    </Box>
  );
};

export default AdminOrderDetailPage;
