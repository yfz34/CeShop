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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const GOODS_TYPE_URL = "/api/GoodsTypes";

const ProductTypeDetail = () => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [loading, setLoading] = useState(true);
  const [goodsType, setGoodsType] = useState({});

  const getGoodsDetail = async () => {
    try {
      let response = await axiosPrivate.get(GOODS_TYPE_URL + `/${id}`);
      // console.log(response.data);
      setGoodsType(response.data);
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
                    <Typography variant="p">商品類別名稱</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    {goodsType.name}
                  </Box>
                </Box>
              </Stack>
            </Paper>

            <Paper elevation={1}>
              <Box m={2}>
                <Typography variant="h5">屬性資料</Typography>
              </Box>

              <Box p={2}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">屬性名稱</TableCell>
                        <TableCell align="center">屬性選項</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {goodsType.typeAttributes.map((att) => (
                        <TableRow
                          key={att.id}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="center" sx={{ width: "150px" }}>
                            {att.name}
                          </TableCell>

                          <TableCell align="center" sx={{ width: "150px" }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              {att.typeAttributeOptions.map((option) => (
                                <p key={option.id}>{option.value},</p>
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>

            <Paper elevation={1}>
              <Box m={2}>
                <Typography variant="h5">規格資料</Typography>
              </Box>

              <Box p={2}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">規格名稱</TableCell>
                        <TableCell align="center">規格選項</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {goodsType.typeSpecifications.map((spec) => (
                        <TableRow
                          key={spec.id}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="center" sx={{ width: "150px" }}>
                            {spec.name}
                          </TableCell>

                          <TableCell align="center" sx={{ width: "150px" }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              {spec.typeSpecificationOptions.map((option) => (
                                <p key={option.id}>{option.value},</p>
                              ))}
                            </Box>
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

export default ProductTypeDetail;
