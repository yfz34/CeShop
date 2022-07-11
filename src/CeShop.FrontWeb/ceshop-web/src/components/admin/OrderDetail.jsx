import {
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
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ORDER_URL = "/api/orders";

const createImageUrl = (name, pixel) =>
  `/api/images/show?name=${name}&pixel=${pixel}`;

const OrderDetail = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState({});

  const getOrderDetail = async () => {
    try {
      let response = await axiosPrivate.get(ORDER_URL + `/${id}`);
      // console.log(response.data);
      setOrderDetail(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOrderDetail();
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
                    <Typography variant="p">訂單編號</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    {orderDetail.code}
                  </Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">購買用戶</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    {orderDetail.account}
                  </Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">合計</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    {orderDetail.totalPrice}
                  </Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">商品數量</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    {orderDetail.totalProduct}
                  </Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">訂單狀態</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    {orderDetail.orderStatus}
                  </Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">購買時間</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    {orderDetail.createTime}
                  </Box>
                </Box>
              </Stack>
            </Paper>
            <Paper elevation={1}>
              <Box m={2}>
                <Typography variant="h5">購買資訊</Typography>
              </Box>
              <Box p={2}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">商品</TableCell>
                        <TableCell align="center">規格</TableCell>
                        <TableCell align="center">單價</TableCell>
                        <TableCell align="center">數量</TableCell>
                        <TableCell align="center">總計</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetail.details.map((detail) => (
                        <TableRow
                          key={detail.id}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="center" sx={{ width: "250px" }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box>
                                <img
                                  src={createImageUrl(detail.picture, 50)}
                                  alt=""
                                />
                              </Box>
                              <Box>{detail.productName}</Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ width: "150px" }}>
                            {detail.specsName}
                          </TableCell>
                          <TableCell align="center" sx={{ width: "150px" }}>
                            {detail.sellPrice}
                          </TableCell>
                          <TableCell align="center" sx={{ width: "150px" }}>
                            {detail.quantity}
                          </TableCell>
                          <TableCell align="center" sx={{ width: "150px" }}>
                            {detail.totalPrice}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default OrderDetail;
