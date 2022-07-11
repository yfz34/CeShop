import { Box, Link, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const AuthStatusPage = () => {
  let { status } = useParams();

  return (
    <Box>
      {status === "success" ? (
        <Box textAlign={"center"}>
          <Box>
            <CheckCircleIcon
              color="success"
              sx={{
                fontSize: "100px",
              }}
            />
          </Box>
          <Typography component="h3" variant="h3">
            驗證成功
          </Typography>
          <Link href="/account/login" color="inherit">
            前往登入頁
          </Link>
        </Box>
      ) : (
        <Box textAlign={"center"}>
          <Box>
            <ErrorIcon
              color="error"
              sx={{
                fontSize: "100px",
              }}
            />
          </Box>
          <Typography component="h3" variant="h3">
            驗證失敗
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AuthStatusPage;
