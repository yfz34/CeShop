import { Box, IconButton, Paper } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ORDERS_URL = "/api/orders";

const Order = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [orders, setOrders] = React.useState([]);
  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(ORDERS_URL + `/${id}`);
      setOrders(orders.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "code",
      headerName: "訂單編號",
      width: 280,
    },
    {
      field: "account",
      headerName: "購買用戶",
      width: 120,
    },
    {
      field: "totalPrice",
      headerName: "價錢",
      type: "number",
      width: 100,
    },
    {
      field: "totalProduct",
      headerName: "商品數量",
      type: "number",
      width: 100,
    },
    {
      field: "orderStatus",
      headerName: "訂單狀態",
      width: 100,
    },
    {
      field: "createTime",
      headerName: "購買時間",
      type: "dateTime",
      width: 200,
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
                navigate("/backstage/order/" + params.row.id);
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
      disableClickEventBubbling: true,
    },
  ];

  const fetchOrders = async () => {
    try {
      let response = await axiosPrivate.get(ORDERS_URL);
      return response?.data.map((order) => ({
        ...order,
        createTime: new Date(order.createTime),
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      let r = await fetchOrders();
      setOrders(r);
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={orders}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // components={{
            //   Pagination: CustomPagination,
            // }}
            disableSelectionOnClick
          />
        </div>
      </Paper>
    </Box>
  );
};

export default Order;
