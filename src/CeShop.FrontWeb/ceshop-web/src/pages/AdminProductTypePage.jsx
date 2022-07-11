import React from "react";
import ContainerTitle from "../components/admin/ContainerTitle";
import ProductType from "../components/admin/ProductType";

const AdminProductTypePage = () => {
  return (
    <div>
      <ContainerTitle title={"商品類別管理"} />
      <ProductType />
    </div>
  );
};

export default AdminProductTypePage;
