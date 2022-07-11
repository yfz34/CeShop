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

import axios from "../api/axios";

const RegisterContainer = styled(Box)({
  width: "100%",
  height: "100%",

  padding: "20px 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const RegisterPaper = styled(Paper)(({ theme }) => ({
  width: "50%",

  [theme.breakpoints.down("md")]: {
    width: "80%",
  },

  [theme.breakpoints.down("sm")]: {
    width: "95%",
  },
}));

const theme = createTheme();

const REGISTER_URL = "/api/accounts/register";

const EMAIL_REGEX = /\S+@\S+\.\S+/;

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;

const RegisterSuccess = ({ email }) => {
  return (
    <Box sx={{ textAlign: "center", paddingTop: "20px" }}>
      <Typography variant="h6">查收你的電子信箱</Typography>
      <Box pt={3}>
        <Typography variant="p">我們已經送出驗證信至{email}</Typography>
      </Box>
      <Box pt={1}>
        <Typography variant="p">請點擊郵件中提供鏈結，完成帳號啟用</Typography>
      </Box>
    </Box>
  );
};

const ShopRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [account, setAccount] = useState("");
  const [accountHelperText, setAccountHelperText] = useState("");

  const [email, setEmail] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHelperText] = useState(
    "密碼須為6個以上，必須包含一個大寫字母以及小寫字母"
  );

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    useState("");

  const [errMsg, setErrMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (account === "") {
      setAccountHelperText("用戶名稱不能為空");
      return;
    } else {
      setAccountHelperText("");
    }

    if (!EMAIL_REGEX.test(email)) {
      setEmailHelperText("Email格式錯誤");
      return;
    } else {
      setEmailHelperText("");
    }

    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    if (!(password === confirmPassword)) {
      setConfirmPasswordHelperText("與密碼不一致");
      return;
    } else {
      setConfirmPasswordHelperText("");
    }
    setIsLoading(true);
    try {
      await axios.post(REGISTER_URL, {
        userName: account,
        email: email,
        password: password,
      });

      setIsSuccess(true);
    } catch (error) {
      setErrMsg(error?.response.data.errors.map((e) => e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <RegisterContainer>
        <RegisterPaper>
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
                CeShop 會員註冊
              </Typography>
              {isSuccess ? (
                <RegisterSuccess email={email} />
              ) : (
                <>
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
                      id="account"
                      label="用戶名稱"
                      name="account"
                      autoComplete="account"
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
                      id="email"
                      label="信箱"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={emailHelperText !== ""}
                      helperText={emailHelperText}
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
                      error={passwordError}
                      helperText={passwordHelperText}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="密碼確認"
                      type="password"
                      id="confirmPassword"
                      autoComplete="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={confirmPasswordHelperText !== ""}
                      helperText={confirmPasswordHelperText}
                    />
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      loading={isLoading}
                    >
                      註冊
                    </LoadingButton>
                  </Box>
                </>
              )}
            </Box>
          </Container>
        </RegisterPaper>
      </RegisterContainer>
    </ThemeProvider>
  );
};

export default ShopRegisterPage;
