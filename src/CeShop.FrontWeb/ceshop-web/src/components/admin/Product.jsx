import {
  Box,
  Button,
  IconButton,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const GOODS_URL = "/api/Goods";
const GOODS_STATUS_URL = "/api/Goods/status";

const createImageUrl = (name, pixel) =>
  `/api/images/show?name=${name}&pixel=${pixel}`;

const RenderStatus = (params) => {
  const axiosPrivate = useAxiosPrivate();

  const [checked, setChecked] = React.useState(
    params.row.status === 1 ? true : false
  );

  const updateStatus = async () => {
    try {
      await axiosPrivate.put(
        GOODS_STATUS_URL + `/${params.row.id}?isShelf=` + !checked
      );
      setChecked((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = () => {
    updateStatus();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="p">{checked ? "上架" : "下架"}</Typography>
      <Switch color="primary" checked={checked} onChange={handleChange} />
    </Box>
  );
};

const Product = () => {
  const navigate = useNavigate();
  const [goodsList, setGoodsList] = React.useState([]);
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(GOODS_URL + `/${id}`);
      setGoodsList(goodsList.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "name",
      headerName: "商品名稱",
      width: 350,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={createImageUrl(params.row.mainPictureName, 50)} alt="" />
            <Box ml={1}>{params.row.name}</Box>
          </Box>
        );
      },
    },
    { field: "code", headerName: "商品代碼", width: 120 },
    { field: "sellPrice", headerName: "價錢", width: 120 },
    {
      field: "stock",
      headerName: "存貨數量",
      width: 120,
    },
    // {
    //   field: "",
    //   headerName: "貨品總類",
    //   width: 120,
    // },
    {
      field: "status",
      headerName: "狀態",
      width: 120,
      renderCell: RenderStatus,
    },
    {
      field: "createTime",
      headerName: "建立時間",
      type: "dateTime",
      width: 170,
    },
    {
      field: "action",
      headerName: "操作",
      width: 150,
      renderCell: (params) => {
        return (
          <strong>
            <IconButton
              aria-label="search"
              onClick={() => {
                navigate("/backstage/product/" + params.row.id);
              }}
            >
              <SearchIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </strong>
        );
      },
    },
  ];

  const fetchGoodsTypes = async () => {
    try {
      let response = await axiosPrivate.get(GOODS_URL);
      return response?.data.map((item) => ({
        ...item,
        createTime: new Date(item.createTime),
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      let data = await fetchGoodsTypes();
      // console.log(r);
      setGoodsList(data);
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Box mb={2}>
        <Button
          variant="contained"
          onClick={() => navigate("/backstage/product/create")}
        >
          新增
        </Button>
      </Box>

      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={goodsList}
            disableSelectionOnClick
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Paper>
    </Box>
  );
};

export default Product;
