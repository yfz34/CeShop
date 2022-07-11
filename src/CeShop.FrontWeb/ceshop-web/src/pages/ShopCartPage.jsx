import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box } from "@mui/system";
import React from "react";
import GlobalContainer from "../components/shop/GlobalContainer";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useMiniCart from "../hooks/useMiniCart";
import useCart from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

const Container = styled(Box)({
  width: "100%",
  height: "100%",

  padding: "20px 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const ProductQuantityInput = styled("input")({
  width: "80px",
  height: "32px",
  // borderLeft: 0,
  // borderRight: 0,
  fontSize: "16px",
  fontWeight: 400,
  boxSizing: "border-box",
  textAlign: "center",
  cursor: "text",
  borderRadius: 0,
});

const ProductQuantityButton = styled("button")({
  borderRadius: 0,
  border: "1px gray solid",
  height: "32px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const CARTS_URL = "/api/carts";

const createImageUrl = (name, pixel) =>
  `/api/images/show?name=${name}&pixel=${pixel}`;

const ShopCartPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setCheckoutList, setCheckoutTotal, purchaseId, setPurchaseId } =
    useCart();
  const miniCart = useMiniCart();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [carts, setCarts] = React.useState([]);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [total, setTotal] = React.useState({
    productTotal: 0,
    price: 0,
    errMsg: "",
  });

  const handleCheckedAllChange = (event) => {
    setCheckedAll(event.target.checked);

    setCarts(
      carts.map((cart) =>
        !cart.disabled
          ? { ...cart, checked: event.target.checked }
          : { ...cart }
      )
    );
  };

  const handleChecked = (event, cartIndex) => {
    setCarts(
      carts.map((item, itemIndex) =>
        itemIndex === cartIndex
          ? {
              ...item,
              checked: event.target.checked,
            }
          : { ...item }
      )
    );
  };

  const handleReduceProductQuantityChange = async (cart) => {
    // setCarts(
    //   carts.map((cartItem) =>
    //     cart.cartDetailId === cartItem.cartDetailId
    //       ? { ...cartItem, errMsg: "" }
    //       : { ...cartItem }
    //   )
    // );

    // if (cart.quantity === 1) {
    //   setCarts(
    //     carts.map((cartItem) =>
    //       cart.cartDetailId === cartItem.cartDetailId
    //         ? { ...cartItem, errMsg: "數量不能小於一" }
    //         : { ...cartItem }
    //     )
    //   );
    //   return;
    // }

    let newQuantity = cart.quantity - 1;

    // update
    try {
      let response = await updateCartDetail(cart.cartDetailId, newQuantity);
      // console.log(response.data);

      setCarts(
        carts.map((cartItem) =>
          cart.cartDetailId === cartItem.cartDetailId
            ? { ...cartItem, quantity: response.data.quantity }
            : { ...cartItem }
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProductQuantityChange = async (cart) => {
    // setCarts(
    //   carts.map((cartItem) =>
    //     cart.cartDetailId === cartItem.cartDetailId
    //       ? { ...cartItem, errMsg: "" }
    //       : { ...cartItem }
    //   )
    // );

    // if (cart.quantity === cart.skuQuantity) {
    //   console.log(cart.quantity);
    //   setCarts(
    //     carts.map((cartItem) =>
    //       cart.cartDetailId === cartItem.cartDetailId
    //         ? { ...cartItem, errMsg: "超過庫存" }
    //         : { ...cartItem }
    //     )
    //   );
    //   return;
    // }

    let newQuantity = cart.quantity + 1;

    // update
    try {
      let response = await updateCartDetail(cart.cartDetailId, newQuantity);
      // console.log(response.data);

      setCarts(
        carts.map((cartItem) =>
          cart.cartDetailId === cartItem.cartDetailId
            ? { ...cartItem, quantity: response.data.quantity }
            : { ...cartItem }
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductQuantityChange = (event, cart) => {
    let newQuantity = event.target.value;
    setCarts(
      carts.map((cartItem) =>
        cart.cartDetailId === cartItem.cartDetailId
          ? { ...cartItem, quantity: newQuantity }
          : { ...cartItem }
      )
    );
  };

  const handleProductQuantityBlur = async (event, cart) => {
    // setCarts(
    //   carts.map((cartItem) =>
    //     cart.cartDetailId === cartItem.cartDetailId
    //       ? { ...cartItem, errMsg: "" }
    //       : { ...cartItem }
    //   )
    // );

    let newQuantity = event.target.value;

    // if (newQuantity > cart.skuQuantity) {
    //   setCarts(
    //     carts.map((cartItem) =>
    //       cart.cartDetailId === cartItem.cartDetailId
    //         ? { ...cartItem, errMsg: "超過庫存" }
    //         : { ...cartItem }
    //     )
    //   );
    // }

    // update
    try {
      let response = await updateCartDetail(cart.cartDetailId, newQuantity);
      // console.log(response.data);

      setCarts(
        carts.map((cartItem) =>
          cart.cartDetailId === cartItem.cartDetailId
            ? { ...cartItem, quantity: response.data.quantity }
            : { ...cartItem }
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCartDetail = async (cart) => {
    try {
      await deleteCartDetail(cart.cartDetailId);
      // console.log(response.data);

      setCarts(
        carts.filter((cartItem) => cart.cartDetailId !== cartItem.cartDetailId)
      );

      miniCart();
    } catch (error) {
      console.error(error);
    }
  };

  const updateCartDetail = async (cartDetailId, quantity) => {
    let updateObj = {
      cartDetailId: cartDetailId,
      quantity: quantity,
    };

    return await axiosPrivate.put(CARTS_URL, updateObj);
  };

  const deleteCartDetail = async (cartDetailId) => {
    return await axiosPrivate.delete(CARTS_URL + `/${cartDetailId}`);
  };

  const handleCheckoutChange = () => {
    let selectedList = carts.filter((cart) => !cart.disabled && cart.checked);
    // console.log(selectedList);

    if (selectedList.length === 0) {
      setTotal({ ...total, errMsg: "請選擇商品" });
      return;
    }

    setCheckoutList(selectedList);
    setCheckoutTotal({
      productTotal: total.productTotal,
      price: total.price,
    });
    navigate("/user/checkout");
  };

  React.useEffect(() => {
    const getCartData = async () => {
      try {
        let response = await axiosPrivate.get(CARTS_URL);
        // console.log(response?.data);

        let data = response?.data;

        setCarts(
          data.map((cartItem) => ({
            ...cartItem,
            disabled:
              cartItem.goodsStatus === 0 || cartItem.skuQuantity === 0
                ? true
                : false,
            checked:
              purchaseId !== 0 && purchaseId === cartItem.cartDetailId
                ? true
                : false,
            errMsg: "",
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getCartData();

    return () => {
      setPurchaseId(0);
    };
  }, []);

  React.useEffect(() => {
    if (carts.length === 0) return;

    let count = 0;
    let price = 0;

    for (let index = 0; index < carts.length; index++) {
      const cart = carts[index];

      if (!cart.disabled && cart.checked) {
        count++;
        price += cart.quantity * cart.price;
      }
    }

    setTotal({ ...total, productTotal: count, price: price });
  }, [carts]);

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
              <Typography variant="h5">購物車</Typography>
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
              ) : carts.length === 0 ? (
                <Box
                  sx={{
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h5">購物車目前沒有任何商品</Typography>
                </Box>
              ) : (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <Box flex={0.5} ml={1}>
                      <Checkbox
                        checked={checkedAll}
                        onChange={handleCheckedAllChange}
                      />
                    </Box>
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
                    <Box flex={0.5} ml={1}>
                      操作
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {carts.map((cart, cartIndex) => (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid gray",
                        }}
                        key={cart.cartDetailId}
                      >
                        <Box flex={0.5} ml={1}>
                          <Checkbox
                            disabled={cart.disabled}
                            checked={cart.checked}
                            onChange={(event) =>
                              handleChecked(event, cartIndex)
                            }
                          />
                        </Box>
                        <Box flex={2} ml={1}>
                          <Box
                            sx={{ display: "flex", cursor: "pointer" }}
                            onClick={() => navigate("/product/" + cart.goodsId)}
                          >
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
                            <ProductQuantityButton
                              onClick={() =>
                                handleReduceProductQuantityChange(cart)
                              }
                              disabled={cart.disabled}
                            >
                              <RemoveIcon />
                            </ProductQuantityButton>
                            <ProductQuantityInput
                              value={cart.quantity}
                              onKeyPress={(e) =>
                                !/[0-9]/.test(e.key) && e.preventDefault()
                              }
                              onChange={(event) =>
                                handleProductQuantityChange(event, cart)
                              }
                              disabled={cart.disabled}
                              onBlur={(e) => handleProductQuantityBlur(e, cart)}
                            />
                            <ProductQuantityButton
                              onClick={() =>
                                handleAddProductQuantityChange(cart)
                              }
                              disabled={cart.disabled}
                            >
                              <AddIcon />
                            </ProductQuantityButton>
                          </Box>
                        </Box>
                        <Box flex={1} ml={1}>
                          {cart.price * cart.quantity}
                        </Box>
                        <Box flex={0.5} ml={1}>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteCartDetail(cart)}
                          >
                            <DeleteIcon />
                          </IconButton>
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
                        總金額 ({total.productTotal} 個商品): ${total.price}
                      </Typography>
                      <Box pl={2}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => handleCheckoutChange()}
                        >
                          去買單
                        </Button>
                      </Box>
                    </Box>
                    {total.errMsg !== "" ? (
                      <Box textAlign={"right"} mt={2}>
                        <Typography variant="p" color={"red"}>
                          {total.errMsg}
                        </Typography>
                      </Box>
                    ) : null}
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

export default ShopCartPage;
