import React from "react";
import ContainerTitle from "../components/admin/ContainerTitle";
import Order from "../components/admin/Order";

const AdminOrderPage = () => {
  return (
    <div>
      <ContainerTitle title={"訂單管理"} />
      <Order />
    </div>
  );
};

export default AdminOrderPage;
