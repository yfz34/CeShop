import React from "react";
import { useParams } from "react-router-dom";
import GlobalContainer from "../components/shop/GlobalContainer";
import ProductList from "../components/shop/ProductList";

const ShopCategoryPage = () => {
  const { category } = useParams();
  const categoryId = category.split("-")[1];
  const categoryName = category.split("-")[0];

  return (
    <GlobalContainer>
      <ProductList
        title={`'${categoryName}'搜尋結果`}
        showPage={true}
        categoryId={categoryId}
      />
    </GlobalContainer>
  );
};

export default ShopCategoryPage;
