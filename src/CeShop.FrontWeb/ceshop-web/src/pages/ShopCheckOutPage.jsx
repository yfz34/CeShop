import {
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React from "react";
import GlobalContainer from "../components/shop/GlobalContainer";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useCart from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import useMiniCart from "../hooks/useMiniCart";

const Container = styled(Box)({
  width: "100%",
  height: "100%",

  padding: "20px 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const USER_ORDER = "/api/userorders";

const createImageUrl = (name, pixel) =>
  `/api/images/show?name=${name}&pixel=${pixel}`;

const ShopCheckOutPage = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { checkoutList, setCheckoutList, checkoutTotal, setCheckoutTotal } =
    useCart();
  const miniCart = useMiniCart();

  const [jump, setJump] = React.useState(true);
  const [buyLoading, setBuyLoading] = React.useState(false);
  const [isBuy, setIsBuy] = React.useState(false);
  const [buySuccess, setBuySuccess] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState("");

  const handleBuyClick = () => {
    setBuyLoading(true);
    setIsBuy(true);
    createUserOrder();
  };

  const createUserOrder = async () => {
    try {
      let createObj = {
        totalPrice: checkoutTotal.price,
        CartDetailIds: checkoutList.map((item) => item.cartDetailId),
      };
      let response = await axiosPrivate.post(USER_ORDER, createObj);
      setBuyLoading(false);
      if (response.data.success) {
        setBuySuccess(true);
        setOrderNumber(response.data.data);
        setCheckoutList([]);
        setCheckoutTotal({
          productTotal: 0,
          price: 0,
        });
        miniCart();
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (checkoutList.length === 0 && jump) {
      navigate("/user/cart");
    }
    setJump(false);
  }, [checkoutList]);

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
              <Typography variant="h5">結帳</Typography>
            </Box>
            <Box sx={{ paddingTop: "20px" }}>
              {isBuy ? (
                buyLoading ? (
                  <Box
                    sx={{
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : buySuccess ? (
                  <Box
                    sx={{
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Box>
                      <CheckCircleIcon
                        color="success"
                        sx={{
                          fontSize: "100px",
                        }}
                      />
                    </Box>
                    <Typography variant="h5">購買成功</Typography>
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      mt={1}
                    >
                      <Typography variant="p">
                        你的訂單編號為"{orderNumber}"
                      </Typography>
                      <Typography variant="p">
                        可至<Link href="/user/order">我的訂單</Link>查詢
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Box>
                      <ErrorIcon
                        color="error"
                        sx={{
                          fontSize: "100px",
                        }}
                      />
                    </Box>
                    <Typography variant="h5">購買失敗</Typography>
                  </Box>
                )
              ) : (
                <Box>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid gray",
                      }}
                    >
                      <Box flex={2} ml={1}>
                        商品
                      </Box>
                      <Box flex={1} ml={1}>
                        規格
                      </Box>
                      <Box flex={1} ml={1}>
                        單價
                      </Box>
                      <Box flex={1} ml={1}>
                        數量
                      </Box>
                      <Box flex={1} ml={1}>
                        總計
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {checkoutList.map((cart) => (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid gray",
                        }}
                        key={cart.cartDetailId}
                      >
                        <Box flex={2} ml={1}>
                          <Box sx={{ display: "flex" }}>
                            <img
                              src={createImageUrl(cart.picture, 50)}
                              alt=""
                            />
                            <Typography variant="p">{cart.name}</Typography>
                          </Box>
                        </Box>
                        <Box flex={1} ml={1}>
                          {cart.skuSpecs}
                        </Box>
                        <Box flex={1} ml={1}>
                          {cart.price}
                        </Box>
                        <Box flex={1} ml={1}>
                          {cart.errMsg !== "" ? (
                            <Box color={"red"}>{cart.errMsg}</Box>
                          ) : null}
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {cart.quantity}
                          </Box>
                        </Box>
                        <Box flex={1} ml={1}>
                          {cart.price * cart.quantity}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ padding: "20px 0" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                      }}
                    >
                      <Typography variant="h5">
                        訂單金額 ({checkoutTotal.productTotal} 商品):$
                        {checkoutTotal.price}
                      </Typography>
                      <Box pl={2}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => handleBuyClick()}
                        >
                          下訂單
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </GlobalContainer>
  );
};

export default ShopCheckOutPage;
