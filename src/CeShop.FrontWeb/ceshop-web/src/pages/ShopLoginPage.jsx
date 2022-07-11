import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Alert, Paper, styled } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const LoginContainer = styled(Box)({
  width: "100%",
  height: "100%",

  padding: "20px 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const LoginPaper = styled(Paper)(({ theme }) => ({
  width: "50%",

  [theme.breakpoints.down("md")]: {
    width: "80%",
  },

  [theme.breakpoints.down("sm")]: {
    width: "95%",
  },
}));

const theme = createTheme();

const LOGIN_URL = "/api/accounts/login";

const ShopLoginPage = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const [account, setAccount] = useState("");
  const [accountHelperText, setAccountHelperText] = useState("");

  const [password, setPassword] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [remember, setRemember] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // const errRef = useRef();

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  const toggleRemember = () => {
    setRemember((prev) => !prev);
  };

  // useEffect(() => {
  //   let account = localStorage.getItem("account");
  //   if (account !== null) setAccount(account);
  // }, []);

  useEffect(() => {
    setErrMsg("");
  }, [account, password]);

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // chack data
    if (account === "") {
      setAccountHelperText("帳號不能為空");
      return;
    } else {
      setAccountHelperText("");
    }

    if (password === "") {
      setPasswordHelperText("密碼不能為空");
      return;
    } else {
      setPasswordHelperText("");
    }

    setIsLoading(true);

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

      // if (remember) localStorage.setItem("account", account);

      navigate(location.state?.from?.pathname || "/", {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LoginContainer>
        <LoginPaper>
          <Container component="main" sx={{ padding: "20px" }}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                CeShop 會員登入
              </Typography>
              <Box>
                {errMsg !== "" ? (
                  <Alert severity="error">{errMsg}</Alert>
                ) : null}
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
                  error={accountHelperText !== ""}
                  helperText={accountHelperText}
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
                  error={passwordHelperText !== ""}
                  helperText={passwordHelperText}
                />
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      checked={remember}
                      onChange={toggleRemember}
                    />
                  }
                  label="記住我"
                /> */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value="remember"
                        color="primary"
                        checked={persist}
                        onChange={togglePersist}
                      />
                    }
                    label="維持登入"
                  />
                </Box>
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  loading={isLoading}
                >
                  登入
                </LoadingButton>
              </Box>
            </Box>
          </Container>
        </LoginPaper>
      </LoginContainer>
    </ThemeProvider>
  );
};

export default ShopLoginPage;
