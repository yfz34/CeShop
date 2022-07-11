import React from "react";
import GlobalContainer from "../components/shop/GlobalContainer";
import ProductDetail from "../components/shop/ProductDetail";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { Box } from "@mui/material";

const ITEM_URL = "/api/items";

const ShopProductDetailPage = () => {
  let { itemId } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [hasData, setHasData] = React.useState(false);
  const [itemData, setItemData] = React.useState({});

  const getItemData = async () => {
    return await axios.get(ITEM_URL + `/${itemId}`);
  };

  const fetchData = async () => {
    setLoading(true);
    let response = await getItemData();
    if (!hasData && response.status === 200) {
      setItemData(response.data);
      setHasData(true);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <GlobalContainer>
      <div>{loading ? <Box></Box> : <ProductDetail itemData={itemData} />}</div>
    </GlobalContainer>
  );
};

export default ShopProductDetailPage;
