import { Box, Button } from "@mui/material";
import React from "react";
import ContainerTitle from "../components/admin/ContainerTitle";
import { useNavigate } from "react-router-dom";
import ProductCreate from "../components/admin/ProductCreate";

const AdminProductCreatePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* <ContainerTitle title={"新增商品"} /> */}
      {/* <Box mb={3}>
        <Button
          variant="contained"
          onClick={() => navigate("/backstage/product")}
        >
          返回
        </Button>
      </Box> */}
      <ProductCreate />
    </div>
  );
};

export default AdminProductCreatePage;
