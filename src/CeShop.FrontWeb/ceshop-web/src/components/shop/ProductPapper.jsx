import { Box, useTheme } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import styled from "@emotion/styled/macro";
import { useNavigate } from "react-router-dom";

const Info = styled(Box)({
  opacity: 0,
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  backgroundColor: "rgba(0,0,0,0.2)",
  zIndex: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.5s ease",
  cursor: "pointer",
});

const Container = styled(Box)(({ theme }) => ({
  width: "25%",
  padding: "0 15px",
  marginBottom: 25,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  // backgroundColor: "#f5fbfd",

  "&:hover": {
    [`${Info}`]: {
      opacity: 1,
    },
  },

  [theme.breakpoints.down("md")]: {
    width: "50%",
  },

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const ImageContainer = styled("div")({
  width: "100%",
  height: "100%",
  position: "relative",
});

const Image = styled("div")(({ image }) => ({
  backgroundImage: `url(${image})`,

  transition: "all 0.4s ease",

  backgroundSize: "cover",

  padding: "50%",
  // minHeight: "initial",

  width: "100%",
  minHeight: "200px",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  overflow: "hidden",
  // backgroundSize: "contain",

  // zIndex: 2,
}));

const Icon = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: 10,
  transition: "all 0.5 ease",
  ":hover": {
    backgroundColor: "#e9f5f5",
    transform: "scale(1.1)",
  },
});

const createImageUrl = (name, pixel) =>
  `/api/images/show?name=${name}&pixel=${pixel}`;

const ProductPapper = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/product/" + item.id);
  };

  return (
    <Container>
      {/* <Image src={item.img} /> */}
      <ImageContainer>
        <Image image={createImageUrl(item.mainImage, 350)} />
        <Info>
          {/* <Icon>
            <ShoppingCartOutlinedIcon />
          </Icon> */}
          <Icon onClick={handleClick}>
            <SearchOutlinedIcon />
          </Icon>
          {/* <Icon>
            <FavoriteBorderOutlinedIcon />
          </Icon> */}
        </Info>
      </ImageContainer>

      <Box textAlign="center">
        <div
          style={{
            paddingTop: 10,
            color: "#333",
            fontSize: "14px",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          {item.name}
        </div>
        <div style={{ color: "#646464", fontSize: 16 }}>
          NT${item.sellPrice}
        </div>
      </Box>
    </Container>
  );
};

export default ProductPapper;
