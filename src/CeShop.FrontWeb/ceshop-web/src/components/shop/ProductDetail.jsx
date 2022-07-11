import {
  Box,
  Button,
  FormControl,
  Link,
  Modal,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useMiniCart from "../../hooks/useMiniCart";
import useCart from "../../hooks/useCart";

const Container = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  margin: "30px 0",
  // padding: "0 30px",

  [theme.breakpoints.down("md")]: {
    margin: "10px 0",
    // padding: "0 10px",
  },

  [theme.breakpoints.down("sm")]: {
    margin: "5px 0",
    // padding: "0 5px",
  },
}));

const ProductInfo = styled(Paper)(({ theme }) => ({
  width: "100%",
  display: "flex",
  padding: "5px",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const ProductPhotoList = styled("div")({
  flex: 1,
  width: "100%",
  padding: "20px",

  display: "flex",
  flexDirection: "column",
});

const ImageContainer = styled("div")({
  border: "solid",
  padding: 0,
  marginBottom: 15,
});

const SmallPhotoToolContainer = styled("div")({
  width: "100%",
  height: 80,

  position: "relative",
  display: "flex",
  justifyContent: "space-between",
});

const SmallImageListContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: 5,
});

const SmallImageContainer = styled("div")((props) => ({
  width: "100%",
  height: "100%",
  border: props.selected ? "solid black 2px" : "solid gray 2px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 3,
  cursor: "pointer",
}));

const SmallImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
});

const PrevButton = styled("div")({
  height: "100%",
  padding: "0 5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "gray",
  color: "white",
  cursor: "pointer",
});

const NextButton = styled("div")({
  height: "100%",
  padding: "0 5px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "gray",
  color: "white",
  cursor: "pointer",
});

const ProductContent = styled("div")({
  flex: 1.3,
  padding: 20,
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

const ADD_CART = "/api/carts";

const createImageUrl = (name, pixel) =>
  `/api/images/show?name=${name}&pixel=${pixel}`;

const ProductDetail = ({ itemData }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const miniCart = useMiniCart();
  const { setPurchaseId } = useCart();

  const [showImage, setShowImage] = React.useState("");
  const [smallImages, setSmallImages] = React.useState([]);

  const [quantity, setQuantity] = React.useState(0);
  const [selectedQuantity, setSelectedQuantity] = React.useState("1");

  const [specs, setSpecs] = React.useState([]);

  const [selectedSpec, setSelectedSpec] = React.useState([]);
  const [selectedSkuId, setSelectedSkuId] = React.useState(0);

  const [selectedSmallImageId, setSelectedSmallImageId] = React.useState(0);

  const [prevSelectedImg, setPrevSelectedImg] = React.useState("");

  const [errMsg, setErrMsg] = React.useState("");
  const [addCartSuccess, setAddCartSuccess] = React.useState(false);

  const handleImagePrev = () => {
    let prevImageId = smallImages.length - 1;

    if (selectedSmallImageId > 0) prevImageId = selectedSmallImageId - 1;

    const smallImage = smallImages.find((img) => img.id === prevImageId);
    setShowImage(createImageUrl(smallImage.name, 600));
    setSelectedSmallImageId(smallImage.id);
    setPrevSelectedImg(smallImage.name);
  };

  const handleImageNext = () => {
    let nextImageId = 0;

    if (selectedSmallImageId < smallImages.length - 1)
      nextImageId = selectedSmallImageId + 1;

    const smallImage = smallImages.find((img) => img.id === nextImageId);
    setShowImage(createImageUrl(smallImage.name, 600));
    setSelectedSmallImageId(smallImage.id);
    setPrevSelectedImg(smallImage.name);
  };

  const handleImageChange = (imageObj) => {
    setShowImage(createImageUrl(imageObj.name, 600));
    setSelectedSmallImageId(imageObj.id);
  };

  const handleProductQuantityChange = (event) => {
    let count = parseInt(event.target.value);

    if (count === 0) {
      return;
    }

    if (quantity < count) {
      setSelectedQuantity(quantity.toString());
    } else {
      setSelectedQuantity(count.toString());
    }
  };

  const handleAddProductQuantityChange = () => {
    let count = parseInt(selectedQuantity) + 1;

    if (quantity < count) {
      setSelectedQuantity(quantity.toString());
    } else {
      setSelectedQuantity(count.toString());
    }
  };

  const handleReduceProductQuantityChange = () => {
    let count = parseInt(selectedQuantity) - 1;

    if (count <= 0) {
      setSelectedQuantity("1");
    } else {
      setSelectedQuantity(count.toString());
    }
  };

  const handleSelectSpecChange = (specId, optionObj) => {
    let optionId = optionObj.id;

    let newSelectedSpec = selectedSpec.map((selected) =>
      selected.specId === specId
        ? {
            ...selected,
            specOptionId: selected.specOptionId === optionId ? -1 : optionId,
          }
        : { ...selected }
    );
    setSelectedSpec(newSelectedSpec);

    if (optionObj.image !== null && optionObj.image !== "") {
      setShowImage(createImageUrl(optionObj.image, 600));
      setPrevSelectedImg(optionObj.image);
    }

    handleSpecModalChange(newSelectedSpec);
  };

  const handleSpecHoverChange = (optionObj) => {
    if (optionObj.image !== null && optionObj.image !== "")
      setShowImage(createImageUrl(optionObj.image, 600));
  };

  const handleSpecHoverLeaveChange = () => {
    setShowImage(createImageUrl(prevSelectedImg, 600));
  };

  const handleSkuListFilter = (skuList, specId, optionId) => {
    let result = [];

    for (let i = 0; i < skuList.length; i++) {
      const sku = skuList[i];
      if (
        sku.skuSpecifications.some(
          (item) =>
            item.specId === specId &&
            (optionId !== -1 ? item.specOptionId === optionId : true)
        )
      ) {
        result.push(sku);
      }
    }

    return result;
  };

  const handleSpecModal = () => {
    let specList = itemData.specifications.map((spec) => ({
      ...spec,
      specificationOption: spec.specificationOption.map((option) => ({
        ...option,
        disabled: false,
      })),
    }));

    let skuList = itemData.goodsSkus;

    // 無規格
    if (specList.length === 0) {
      setSpecs(specList);
      return;
    }

    specList = specList.map((spec) => ({
      ...spec,
      specificationOption: spec.specificationOption.map((option) => {
        const optionId = option.id;
        const filterSkus = handleSkuListFilter(skuList, spec.id, optionId);
        const skus = filterSkus.filter((s) => s.quantity === 0);
        if (skus.length === filterSkus.length) {
          return { ...option, disabled: true };
        }
        return { ...option, disabled: false };
      }),
    }));
    setSpecs(specList);
  };

  const handleSpecModalChange = (newSelectedSpec) => {
    let goodsSkus = itemData.goodsSkus;

    // 1
    if (newSelectedSpec.length === 1) {
      // call api
      // 更改存貨
    }

    // 2
    let newSpecs = specs;
    for (let i = 0; i < newSelectedSpec.length; i++) {
      const selectedSpec = newSelectedSpec[i];

      // if (selectedSpec.specOptionId === -1) {
      //   continue;
      // }

      let filterGoodsSkus = handleSkuListFilter(
        goodsSkus,
        selectedSpec.specId,
        selectedSpec.specOptionId
      );

      let filterSpecs = specs.filter((spec) => spec.id !== selectedSpec.specId);

      for (let j = 0; j < filterSpecs.length; j++) {
        let filterSpec = filterSpecs[j];

        // console.log(filterSpec);

        filterSpec.specificationOption = filterSpec.specificationOption.map(
          (option) => {
            const optionId = option.id;
            const filterSkus = handleSkuListFilter(
              filterGoodsSkus,
              filterSpec.id,
              optionId
            );
            const skus = filterSkus.filter((s) => s.quantity === 0);
            if (skus.length === filterSkus.length) {
              return { ...option, disabled: true };
            }
            return { ...option, disabled: false };
          }
        );

        newSpecs = newSpecs.map((spec) =>
          filterSpec.id === spec.id ? filterSpec : { ...spec }
        );
      }

      setSpecs(newSpecs);
    }
  };

  const checkLogin = () => {
    return auth.hasOwnProperty("accessToken");
  };

  const directPurchase = async () => {
    // 確認有無登入
    if (!checkLogin()) {
      console.log("尚未登入");
      navigate("/account/login");
    }

    // 確認規格選擇
    if (!checkSelectedAllSpec()) {
      setErrMsg("請先選擇商品規格");
      return;
    }

    // call api
    let cartObj = {
      GoodsId: itemData.id,
      SkuId: selectedSkuId,
      Quantity: parseInt(selectedQuantity),
    };
    // console.log(cartObj);
    try {
      let response = await axiosPrivate.post(ADD_CART, cartObj);
      miniCart();
      // console.log(response);
      setPurchaseId(response.data.id);
      navigate("/user/cart");
    } catch (error) {
      // console.log(error);
      setErrMsg(error.response?.data);
    }
  };

  const addCart = async () => {
    // 確認有無登入
    if (!checkLogin()) {
      console.log("尚未登入");
      navigate("/account/login");
    }

    // 確認規格選擇
    if (!checkSelectedAllSpec()) {
      setErrMsg("請先選擇商品規格");
      return;
    }

    // call api
    let cartObj = {
      GoodsId: itemData.id,
      SkuId: selectedSkuId,
      Quantity: parseInt(selectedQuantity),
    };
    // console.log(cartObj);
    try {
      await axiosPrivate.post(ADD_CART, cartObj);
      await miniCart();
      setAddCartSuccess(true);
    } catch (error) {
      // console.log(error);
      setErrMsg(error.response?.data);
    }
  };

  const checkSelectedAllSpec = () => {
    let hasRenew = true;
    for (let index = 0; index < selectedSpec.length; index++) {
      const element = selectedSpec[index];
      if (element.specOptionId === -1) hasRenew = false;
    }
    return hasRenew;
  };

  React.useEffect(() => {
    setErrMsg("");

    if (selectedSpec.length === 0) return;

    if (!checkSelectedAllSpec()) return;

    // console.log(selectedSpec);
    // console.log(itemData.goodsSkus);
    let skus = itemData.goodsSkus;

    for (let index = 0; index < selectedSpec.length; index++) {
      const selectedItem = selectedSpec[index];
      skus = skus.filter((sku) =>
        sku.skuSpecifications.some(
          (spec) =>
            spec.specId === selectedItem.specId &&
            spec.specOptionId === selectedItem.specOptionId
        )
      );
    }
    // console.log(skus);
    if (skus.length !== 1) {
      console.log("未找到SKU");
      return;
    }
    setQuantity(skus[0].quantity);
    setSelectedQuantity(1);
    setSelectedSkuId(skus[0].id);
  }, [selectedSpec]);

  React.useEffect(() => {
    // console.log(itemData);

    setShowImage(createImageUrl(itemData.mainImage, 600));
    setPrevSelectedImg(itemData.mainImage);

    let images = itemData.images.map((image, index) => {
      return {
        id: index,
        name: image,
        url: createImageUrl(image, 100),
      };
    });

    setSmallImages(images);

    // setSpecs(
    //   itemData.specifications.map((spec) => ({
    //     ...spec,
    //     specificationOption: spec.specificationOption.map((option) => ({
    //       ...option,
    //       disabled: false,
    //     })),
    //   }))
    // );
    handleSpecModal();

    setSelectedSpec(
      itemData.specifications.map((spec) => ({
        specId: spec.id,
        specOptionId: -1,
      }))
    );

    setQuantity(itemData.stock);
  }, [itemData]);

  return (
    <Container>
      <ProductInfo>
        <ProductPhotoList>
          <ImageContainer>
            <img src={showImage} alt="" width="100%" />
          </ImageContainer>
          <SmallPhotoToolContainer>
            <PrevButton onClick={() => handleImagePrev()}>
              <ArrowBackIosNewIcon />
            </PrevButton>

            <SmallImageListContainer>
              {smallImages.map((smallImage) => (
                <SmallImageContainer
                  key={smallImage.id}
                  onClick={() => handleImageChange(smallImage)}
                  selected={smallImage.id === selectedSmallImageId}
                >
                  <SmallImage src={smallImage.url} alt="" />
                </SmallImageContainer>
              ))}
            </SmallImageListContainer>

            <NextButton onClick={() => handleImageNext()}>
              <ArrowForwardIosIcon />
            </NextButton>
          </SmallPhotoToolContainer>
        </ProductPhotoList>
        <ProductContent>
          <Typography variant="h5" mb={3}>
            {itemData?.name}
          </Typography>
          <Typography variant="h5" mb={5}>
            NT${itemData?.price}
          </Typography>
          <FormControl fullWidth>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {specs.map((spec, index) => (
                <Box
                  mb={3}
                  pl={2}
                  sx={{ display: "flex", alignItems: "center" }}
                  key={spec.id}
                >
                  <Box
                    sx={{
                      color: "#757575",
                      width: "110px",
                      textTransform: "capitalize",
                      flexShrink: 0,
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="p">{spec.name}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {spec.specificationOption.map((option) => (
                      <Box sx={{ margin: "0 8px 8px 0" }} key={option.id}>
                        <Button
                          variant={
                            selectedSpec[index].specId === spec.id &&
                            selectedSpec[index].specOptionId === option.id
                              ? "contained"
                              : "outlined"
                          }
                          onMouseEnter={() => handleSpecHoverChange(option)}
                          onMouseLeave={() => handleSpecHoverLeaveChange()}
                          onClick={() =>
                            handleSelectSpecChange(spec.id, option)
                          }
                          disabled={option.disabled}
                        >
                          {option.name}
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}

              <Box pl={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    color: "#757575",
                    width: "110px",
                    textTransform: "capitalize",
                    flexShrink: 0,
                    alignItems: "center",
                  }}
                >
                  <Typography variant="p">數量</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box mr={1}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ProductQuantityButton
                        onClick={() => handleReduceProductQuantityChange()}
                      >
                        <RemoveIcon />
                      </ProductQuantityButton>
                      <ProductQuantityInput
                        value={selectedQuantity}
                        onKeyPress={(e) =>
                          !/[0-9]/.test(e.key) && e.preventDefault()
                        }
                        onChange={(event) => handleProductQuantityChange(event)}
                      />
                      <ProductQuantityButton
                        onClick={() => handleAddProductQuantityChange()}
                      >
                        <AddIcon />
                      </ProductQuantityButton>
                    </Box>
                  </Box>
                  <Typography variant="p">還剩{quantity}件</Typography>
                </Box>
              </Box>
            </Box>

            {errMsg !== "" ? (
              <Box pl={2} pt={2}>
                <Typography variant="p" color="error">
                  {errMsg}
                </Typography>
              </Box>
            ) : null}

            <Box
              sx={{ marginTop: 5, marginBottom: 3, display: "flex", gap: 3 }}
            >
              <Button
                sx={{ padding: 2 }}
                variant="outlined"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => addCart()}
              >
                加入購物車
              </Button>
              <Button
                sx={{ padding: 2 }}
                variant="contained"
                startIcon={<ShoppingBasketIcon />}
                onClick={() => directPurchase()}
              >
                直接購買
              </Button>
            </Box>

            {/* <Box sx={{ textAlign: "center" }}>
              <Button
                variant="text"
                startIcon={love ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={() => handleLoveChange()}
                color="error"
              >
                加入追蹤
              </Button>
            </Box> */}
          </FormControl>
        </ProductContent>
      </ProductInfo>

      <Box mt={5}>
        <Paper elevation={2}>
          <Box p={5}>
            <Box>
              <Typography variant="h5">商品屬性</Typography>
            </Box>
            <Box mt={5}>
              <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "8.75rem" }}>
                  <Typography variant="p">分類</Typography>
                </Box>
                {itemData.categories.map((category, index) => (
                  <Box
                    key={category.id}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Link
                      component={RouterLink}
                      to={`/category/${category.name}-${category.id}`}
                      underline="none"
                    >
                      {category.name}
                    </Link>
                    {/* <Link href="/" underline="none">
                      {category.name}
                    </Link> */}
                    {index !== itemData.categories.length - 1 ? (
                      <NavigateNextIcon />
                    ) : null}
                  </Box>
                ))}
              </Box>
              {itemData.attributes.map((attribute) => (
                <Box
                  mb={2}
                  sx={{ display: "flex", alignItems: "center" }}
                  key={attribute.id}
                >
                  <Box sx={{ width: "8.75rem" }}>
                    <Typography variant="p">{attribute.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="p">{attribute.value}</Typography>
                  </Box>
                </Box>
              ))}
              <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "8.75rem" }}>
                  <Typography variant="p">商品數量</Typography>
                </Box>
                <Box>
                  <Typography variant="p">{quantity}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box p={5}>
            <Box>
              <Typography variant="h5">商品詳情</Typography>
            </Box>
            <Box mt={5}>
              <Typography variant="p" sx={{ whiteSpace: "pre-line" }}>
                {itemData.description}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Modal
        open={addCartSuccess}
        onClose={() => setAddCartSuccess(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Box id="modal-modal-title">
            <CheckCircleIcon
              color="success"
              sx={{
                fontSize: "100px",
              }}
            />
          </Box>
          <Typography
            mt={2}
            id="modal-modal-description"
            variant="h6"
            component="h2"
          >
            商品已加入購物車
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
};

export default ProductDetail;
