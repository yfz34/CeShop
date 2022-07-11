import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import GlobalContainer from "../components/shop/GlobalContainer";
import { LoadingButton } from "@mui/lab";

const Container = styled(Box)({
  width: "100%",
  height: "100%",

  padding: "20px 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const AlertMessage = ({ message, isSuccess }) => {
  const severity = isSuccess ? "success" : "error";

  return <Alert severity={severity}>{message}</Alert>;
};

const USER_URL = "/api/users";
const USER_INFO = USER_URL + "/userinfo";

const ShopUserProfilePage = () => {
  const axiosPrivate = useAxiosPrivate();

  const [saveLoading, setSaveLoading] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState("");
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const [userData, setUserData] = React.useState(null);

  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [birthdate, setBirthdate] = React.useState("");
  const [address, setAddress] = React.useState("");

  const handleGenderRadioChange = (event) => {
    setGender(event.target.value);
  };

  const getUserInfo = () => {
    // axiosPrivate.get(USER_INFO).then((res) => console.log(res));

    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(USER_INFO, {
          signal: controller.signal,
        });
        // console.log(response.data);

        if (isMounted) {
          let userInfo = response?.data;
          setUserData(userInfo);
          setUserName(userInfo.userName ?? "");
          setEmail(userInfo.email ?? "");
          setPhoneNumber(userInfo.phoneNumber ?? "");
          setGender(userInfo.sex ?? "");
          setBirthdate(userInfo.birthDate ?? "");
          setAddress(userInfo.address ?? "");
        }
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const updateUserProfile = async () => {
    setSaveLoading(true);

    try {
      let updateObj = {
        id: userData.id,
        userName: userName,
        phoneNumber: phoneNumber,
        sex: gender,
        birthDate: birthdate,
        address: address,
      };
      // console.log(updateObj);
      await axiosPrivate.put(USER_URL, updateObj);
      setSaveMessage("儲存成功");
      setSaveSuccess(true);
    } catch (error) {
      console.error(error);
      setSaveMessage("儲存失敗 " + error.response.data);
      setSaveSuccess(false);
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <GlobalContainer>
      <Container>
        <Paper sx={{ width: "100%" }}>
          <Box sx={{ padding: "0 20px" }}>
            <Box
              sx={{
                padding: "20px 0",
                borderBottom: "1px solid gray",
              }}
            >
              <Typography variant="h5">個人資料</Typography>
              <Typography variant="p">管理你的檔案以保護你的帳戶</Typography>
            </Box>
            <Box sx={{ paddingTop: "20px" }}>
              {saveMessage === "" ? null : (
                <Box sx={{ marginBottom: "20px" }}>
                  <AlertMessage message={saveMessage} isSuccess={saveSuccess} />
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Box sx={{ textAlign: "right", flex: 1 }}>姓名</Box>
                  <Box sx={{ paddingLeft: "20px", flex: 6 }}>
                    <TextField
                      variant="outlined"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Box sx={{ textAlign: "right", flex: 1 }}>Email</Box>
                  <Box sx={{ paddingLeft: "20px", flex: 6 }}>
                    <Typography variant="p">{email}</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Box sx={{ textAlign: "right", flex: 1 }}>手機號碼</Box>
                  <Box sx={{ paddingLeft: "20px", flex: 6 }}>
                    <TextField
                      variant="outlined"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Box sx={{ textAlign: "right", flex: 1 }}>性別</Box>
                  <Box sx={{ paddingLeft: "20px", flex: 6 }}>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={gender}
                        onChange={handleGenderRadioChange}
                      >
                        <FormControlLabel
                          value="男性"
                          control={<Radio />}
                          label="男性"
                        />
                        <FormControlLabel
                          value="女性"
                          control={<Radio />}
                          label="女性"
                        />
                        <FormControlLabel
                          value="其他"
                          control={<Radio />}
                          label="其他"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Box sx={{ textAlign: "right", flex: 1 }}>生日</Box>
                  <Box sx={{ paddingLeft: "20px", flex: 6 }}>
                    <TextField
                      variant="outlined"
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Box sx={{ textAlign: "right", flex: 1 }}>地址</Box>
                  <Box sx={{ paddingLeft: "20px", flex: 6 }}>
                    <TextField
                      variant="outlined"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Box sx={{ textAlign: "right", flex: 1 }}></Box>
                  <Box sx={{ paddingLeft: "20px", flex: 6 }}>
                    <LoadingButton
                      loading={saveLoading}
                      variant="contained"
                      onClick={updateUserProfile}
                    >
                      儲存
                    </LoadingButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </GlobalContainer>
  );
};

export default ShopUserProfilePage;
