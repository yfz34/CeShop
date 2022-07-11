import {
  Box,
  Button,
  CircularProgress,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import GlobalContainer from "../components/shop/GlobalContainer";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

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

const ShopUserOrderPage = () => {
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = React.useState(true);
  const [hasOrder, setHasOrder] = React.useState(false);

  const [orders, setOrders] = React.useState([]);
  const [orderNumber, setOrderNumber] = React.useState("");
  const [totalProduct, setTotalProduct] = React.useState(0);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [orderDetails, setOrderDetails] = React.useState([]);
  const [showDetail, setShowDetail] = React.useState(false);

  const enterDetailChange = (id) => {
    let order = orders.find((order) => order.id === id);
    setOrderDetails(order.orderDetails);
    setTotalProduct(order.totalProduct);
    setTotalPrice(order.totalPrice);
    setOrderNumber(order.code);
    setShowDetail(true);
  };

  const backOrders = () => {
    setOrderDetails([]);
    setTotalProduct(0);
    setTotalPrice(0);
    setOrderNumber("");
    setShowDetail(false);
  };

  React.useEffect(() => {
    const getUserOrder = async () => {
      let response = await axiosPrivate.get(USER_ORDER);
      // console.log(response?.data);
      setOrders(response?.data);
      setLoading(false);
    };

    try {
      getUserOrder();
    } catch (error) {
      console.error(error);
    }
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
              <Typography variant="h5">我的訂單</Typography>
            </Box>
            <Box sx={{ paddingTop: "20px" }}>
              {loading ? (
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
              ) : orders.length === 0 ? (
                <Box
                  sx={{
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h5">目前沒有任何訂單</Typography>
                </Box>
              ) : !showDetail ? (
                <Box pb={5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <Box flex={2} ml={1}>
                      訂單編號
                    </Box>
                    <Box flex={1} ml={1}>
                      訂單日期
                    </Box>
                    <Box flex={1} ml={1}>
                      合計
                    </Box>
                    <Box flex={1} ml={1}>
                      訂單狀態
                    </Box>
                    <Box flex={1} ml={1}></Box>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {orders.map((order) => (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid gray",
                        }}
                        key={order.id}
                      >
                        <Box flex={2} ml={1}>
                          {order.code}
                        </Box>
                        <Box flex={1} ml={1}>
                          {order.createTime.split("T")[0]}
                        </Box>
                        <Box flex={1} ml={1}>
                          {order.totalPrice}
                        </Box>
                        <Box flex={1} ml={1}>
                          {order.orderStatus}
                        </Box>
                        <Box flex={1} ml={1}>
                          <Button
                            variant="contained"
                            onClick={() => enterDetailChange(order.id)}
                          >
                            查閱
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Button variant="contained" onClick={() => backOrders()}>
                    返回
                  </Button>
                  <Box pt={4} pb={3}>
                    <Typography variant="h6">
                      訂單編號: {orderNumber}
                    </Typography>
                  </Box>
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
                    {orderDetails.map((detail) => (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid gray",
                        }}
                        key={detail.id}
                      >
                        <Box flex={2} ml={1}>
                          <Box sx={{ display: "flex" }}>
                            <img
                              src={createImageUrl(detail.picture, 50)}
                              alt=""
                            />
                            <Typography variant="p">
                              {detail.productName}
                            </Typography>
                          </Box>
                        </Box>
                        <Box flex={1} ml={1}>
                          {detail.specsName}
                        </Box>
                        <Box flex={1} ml={1}>
                          {detail.sellPrice}
                        </Box>
                        <Box flex={1} ml={1}>
                          {detail.quantity}
                        </Box>
                        <Box flex={1} ml={1}>
                          {detail.sellPrice * detail.quantity}
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
                        總金額 ({totalProduct} 商品):$
                        {totalPrice}
                      </Typography>
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

export default ShopUserOrderPage;
