import React from "react";

import Carouselbar from "../components/shop/Carouselbar/Carouselbar";
import GlobalContainer from "../components/shop/GlobalContainer";
import ProductList from "../components/shop/ProductList";

const ShopHomePage = () => {
  return (
    <GlobalContainer>
      <Carouselbar />
      <ProductList title={"最新商品"} />
    </GlobalContainer>
  );
};

export default ShopHomePage;
