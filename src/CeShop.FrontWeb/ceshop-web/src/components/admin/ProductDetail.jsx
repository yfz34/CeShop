import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const GOODS_URL = "/api/goods";
const createImageUrl = (name, pixel) =>
  `/api/images/show?name=${name}&pixel=${pixel}`;

const ProductDetail = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState(true);
  const [goods, setGoods] = useState({});

  const getGoodsDetail = async () => {
    try {
      let response = await axiosPrivate.get(GOODS_URL + `/${id}`);
      // console.log(response.data);
      setGoods(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGoodsDetail();
  }, []);

  return (
    <Box>
      {loading ? null : (
        <Box mb={5} mt={5}>
          <Stack
            component="form"
            sx={{
              width: "100%",
            }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <Paper elevation={1}>
              <Box m={2}>
                <Typography variant="h5">基本資訊</Typography>
              </Box>

              <Stack>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">商品名稱</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>{goods.name}</Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">類別</Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 6,
                      padding: "0 30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {goods.categories.map((category, index) => (
                      <Box
                        key={category.id}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Box>{category.name}</Box>
                        <Box>
                          {index !== goods.categories.length - 1 ? (
                            <NavigateNextIcon />
                          ) : null}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    // alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">商品描述</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    <Typography variant="p" sx={{ whiteSpace: "pre-line" }}>
                      {goods.description}
                    </Typography>
                  </Box>
                </Box>
                {goods.attributes.map((att) => (
                  <Box
                    m={2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    key={att.id}
                  >
                    <Box sx={{ flex: 1, textAlign: "right" }}>
                      <Typography variant="p">{att.name}</Typography>
                    </Box>
                    <Box sx={{ flex: 6, padding: "0 30px" }}>{att.value}</Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
            <Paper elevation={1}>
              <Box m={2}>
                <Typography variant="h5">銷售資訊</Typography>
              </Box>

              <Stack>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">商品代碼</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>{goods.code}</Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">價格</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>{goods.price}</Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    // alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">商品數量</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>{goods.stock}</Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    // alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">規格表</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            {goods.specifications.map((spec) => (
                              <TableCell align="center" key={spec.id}>
                                {spec.name}
                              </TableCell>
                            ))}
                            <TableCell align="center">價格</TableCell>
                            <TableCell align="center">商品數量</TableCell>
                            <TableCell align="center">商品選項貨號</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {goods.goodsSkus.map((sku) => (
                            <TableRow
                              key={sku.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              {sku.skuSpecifications.map((spec) => (
                                <TableCell
                                  align="center"
                                  sx={{ width: "150px" }}
                                  key={spec.specId}
                                >
                                  {spec.specOptionName}
                                </TableCell>
                              ))}

                              <TableCell align="center" sx={{ width: "150px" }}>
                                {sku.price}
                              </TableCell>
                              <TableCell align="center" sx={{ width: "150px" }}>
                                {sku.quantity}
                              </TableCell>
                              <TableCell align="center" sx={{ width: "150px" }}>
                                {sku.skuCode}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </Stack>
            </Paper>
            <Paper elevation={1}>
              <Box m={2}>
                <Box mb={2}>
                  <Typography variant="h5">照片</Typography>
                </Box>

                <Box>
                  <Typography component={"p"}>商品照片</Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap" }} fullWidth>
                  {goods.images.map((image, index) => (
                    <Box key={image}>
                      <Box
                        p={2}
                        sx={{
                          width: "200px",
                          height: "200px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            border: "1px gray solid",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={createImageUrl(image, 200)}
                              alt=""
                              width={"80%"}
                              height={"80%"}
                            />
                          </Box>
                        </Box>
                        <Box textAlign={"center"}>
                          <Typography variant="p" component={"p"}>
                            {index === 0 ? "主要商品照片" : index}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {goods.specifications.map((spec) => (
                  <Box key={spec.id}>
                    <Box>
                      <Typography component={"p"}>{spec.name}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }} fullWidth>
                      {spec.specificationOption.map((option, index) => (
                        // option.image == null ? null :
                        <Box key={index}>
                          <Box
                            p={2}
                            sx={{
                              width: "200px",
                              height: "200px",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                border: "1px gray solid",
                                position: "relative",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {option.image == null ? null : (
                                  <img
                                    src={createImageUrl(option.image, 200)}
                                    alt=""
                                    width={"80%"}
                                    height={"80%"}
                                  />
                                )}
                              </Box>
                            </Box>
                            <Box textAlign={"center"}>
                              <Typography variant="p" component={"p"}>
                                {option.name}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetail;
