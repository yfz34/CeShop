import React from "react";
import { Box, Pagination, Paper, styled, Typography } from "@mui/material";
import ProductPapper from "./ProductPapper";
import axios from "../../api/axios";
import { useEffect } from "react";

const ProductContainer = styled(Box)({
  width: "100%",
  height: "auto",
  display: "flex",
  flexWrap: "wrap",
});

const ITEMS_URL = "/api/items/paging";

const ProductList = ({ title, showPage, categoryId, keyword }) => {
  const [pageCount, setPageCount] = React.useState(1);
  const [pageSize] = React.useState(8);

  const [products, setProducts] = React.useState([]);

  const handlePageChange = (event, page) => {
    // console.log(event);
    // console.log(page);
    setPageCount(page);
  };

  const getProducts = async (page, size, order) => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const response = await axios.get(ITEMS_URL, {
          signal: controller.signal,
          params: {
            page: page,
            size: size,
            order: order,
            categoryId,
            keyword,
          },
        });

        if (isMounted) {
          let data = response?.data;
          setPageCount(Math.ceil(data.totalCount / pageSize));
          setProducts(data.results);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  useEffect(() => {
    getProducts(pageCount, pageSize, title === "全部商品" ? "asc" : "desc");
  }, [title, pageCount, pageSize]);

  return (
    <Paper>
      <Box mt={5} mb={5} pt={2}>
        <Box>
          <Typography variant="h4" textAlign={"center"}>
            {title}
          </Typography>
        </Box>
        <Box
          sx={{ padding: "20px 0", display: "flex", justifyContent: "center" }}
        >
          {showPage && products.length > 0 ? (
            <Pagination
              count={pageCount}
              color="primary"
              onChange={handlePageChange}
            />
          ) : null}
        </Box>
        {products.length > 0 ? (
          <ProductContainer>
            {products.map((item) => (
              <ProductPapper item={item} key={item.id} />
            ))}
          </ProductContainer>
        ) : (
          <Box pb={5}>
            <Typography variant="h6" textAlign={"center"}>
              查無商品
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ProductList;
