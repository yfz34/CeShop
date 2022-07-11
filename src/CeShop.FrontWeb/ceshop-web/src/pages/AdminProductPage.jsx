import React from "react";
import ContainerTitle from "../components/admin/ContainerTitle";
import Product from "../components/admin/Product";

const AdminProductPage = () => {
  return (
    <div>
      <ContainerTitle title={"商品管理"} />
      <Product />
    </div>
  );
};

export default AdminProductPage;
