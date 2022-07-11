import React from "react";
import { useParams } from "react-router-dom";
import GlobalContainer from "../components/shop/GlobalContainer";
import ProductList from "../components/shop/ProductList";

const ShopKeywordPage = () => {
  const { name } = useParams();

  return (
    <GlobalContainer>
      <ProductList title={`'${name}'搜尋結果`} showPage={true} keyword={name} />
    </GlobalContainer>
  );
};

export default ShopKeywordPage;
