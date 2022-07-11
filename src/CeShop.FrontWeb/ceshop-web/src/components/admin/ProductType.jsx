import { Box, Button, IconButton, Paper } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const GoodsTypes_URL = "/api/GoodsTypes";

// const CustomPagination = () => {
//   const apiRef = useGridApiContext();
//   const page = useGridSelector(apiRef, gridPageSelector);
//   const pageCount = useGridSelector(apiRef, gridPageCountSelector);

//   return (
//     <Pagination
//       color="primary"
//       count={pageCount}
//       page={page + 1}
//       onChange={(event, value) => apiRef.current.setPage(value - 1)}
//     />
//   );
// };

const ProductType = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [goodsTypes, setGoodsTypes] = React.useState([]);

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(GoodsTypes_URL + `/${id}`);
      setGoodsTypes(goodsTypes.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "類別名稱",
      width: 100,
    },
    {
      field: "specifications",
      headerName: "規格數量",
      type: "number",
      width: 100,
    },
    {
      field: "attributes",
      headerName: "屬性數量",
      type: "number",
      width: 100,
    },
    {
      field: "createTime",
      headerName: "建立時間",
      type: "dateTime",
      width: 200,
    },
    {
      field: "updateTime",
      headerName: "修改時間",
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
                navigate("/backstage/producttype/" + params.row.id);
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

  const fetchGoodsTypes = async () => {
    try {
      let response = await axiosPrivate.get(GoodsTypes_URL);
      return response?.data.map((item) => ({
        id: item.id,
        name: item.name,
        attributes: item.typeAttributes.length,
        specifications: item.typeSpecifications.length,
        createTime: new Date(item.createTime),
        updateTime: new Date(item.updateTime),
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      let r = await fetchGoodsTypes();
      setGoodsTypes(r);
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Box mb={2}>
        <Button
          variant="contained"
          onClick={() => navigate("/backstage/producttype/create")}
        >
          新增
        </Button>
      </Box>
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={goodsTypes}
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

export default ProductType;
