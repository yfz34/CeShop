import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";
import useMiniCart from "../../hooks/useMiniCart";

const ShopRersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();
  const miniCart = useMiniCart();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true) return;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      effectRan.current = true;
    };
  }, []);

  useEffect(() => {
    if (auth.hasOwnProperty("accessToken")) {
      miniCart();
    }
  }, [auth]);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default ShopRersistLogin;
