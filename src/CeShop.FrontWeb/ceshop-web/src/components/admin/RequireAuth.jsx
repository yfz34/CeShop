import { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="/backstage/login" state={{ from: location }} replace />
  ) : (
    <Navigate to="/backstage/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
