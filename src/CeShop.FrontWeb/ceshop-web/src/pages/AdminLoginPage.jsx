import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Alert } from "@mui/material";

import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const theme = createTheme();

const LOGIN_URL = "/api/accounts/login";

const AdminLoginPage = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [account, setAccount] = useState("admin");
  const [password, setPassword] = useState("Admin123");
  const [errMsg, setErrMsg] = useState("");

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    setErrMsg("");
  }, [account, password]);

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, {
        account: account,
        password: password,
      });
      // console.log(response?.data);

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles?.map((role) => role.name);

      setAuth({ account, accessToken, roles });

      setAccount("");
      setPassword("");

      navigate(location.state?.from?.pathname || "/backstage", {
        replace: true,
      });
    } catch (error) {
      if (!error?.response) {
        setErrMsg("服務錯誤");
      } else if (error.response?.status === 400) {
        setErrMsg("帳號密碼錯誤");
      } else if (error.response?.status === 401) {
        setErrMsg("未授權");
      } else {
        setErrMsg("登入錯誤");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            後臺管理系統
          </Typography>
          <Box>
            {errMsg !== "" ? <Alert severity="error">{errMsg}</Alert> : null}
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="使用者名稱或信箱"
              name="email"
              autoComplete="email"
              autoFocus
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密碼"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={persist}
                  onChange={togglePersist}
                />
              }
              label="保持登入"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              登入
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AdminLoginPage;
