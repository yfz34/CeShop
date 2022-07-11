import React from "react";
import ContainerTitle from "../components/admin/ContainerTitle";
import Category from "../components/admin/Category";

const AdminCategoriesPage = () => {
  return (
    <div>
      <ContainerTitle title={"商品分類管理"} />
      <Category />
    </div>
  );
};

export default AdminCategoriesPage;
