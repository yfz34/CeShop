import React, { useEffect } from "react";
import GlobalContainer from "../components/shop/GlobalContainer";
import ProductList from "../components/shop/ProductList";

const ShopProductListPage = ({ title }) => {
  return (
    <GlobalContainer>
      <ProductList title={title} showPage={true} />
    </GlobalContainer>
  );
};

export default ShopProductListPage;
