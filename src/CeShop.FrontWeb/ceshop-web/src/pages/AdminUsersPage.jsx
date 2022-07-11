import React from "react";
import ContainerTitle from "../components/admin/ContainerTitle";
import User from "../components/admin/User";

const AdminUsersPage = () => {
  return (
    <div>
      <ContainerTitle title={"顧客管理"} />
      <User />
    </div>
  );
};

export default AdminUsersPage;
