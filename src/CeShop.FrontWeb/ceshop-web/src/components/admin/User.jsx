import { Box, IconButton, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import DeleteIcon from "@mui/icons-material/Delete";

const USER_URL = "/api/users";

const User = () => {
  const axiosPrivate = useAxiosPrivate();

  const [users, setUsers] = React.useState([]);

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(USER_URL + `/${id}`);
      setUsers(users.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "account",
      headerName: "用戶名稱",
      width: 100,
    },
    {
      field: "userName",
      headerName: "姓名",
      width: 100,
    },
    {
      field: "email",
      headerName: "Email",
      width: 170,
    },
    {
      field: "phoneNumber",
      headerName: "手機號碼",
      width: 170,
    },
    {
      field: "sex",
      headerName: "性別",
      width: 170,
    },
    {
      field: "birthDate",
      headerName: "生日",
      width: 170,
    },
    {
      field: "address",
      headerName: "地址",
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

  const fetchUsers = async () => {
    try {
      let response = await axiosPrivate.get(USER_URL + "/all");
      // console.log(response.data);
      return response?.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      let r = await fetchUsers();
      setUsers(
        r.map((user) => ({
          id: user.id,
          account: user.userName,
          userName: user.userProfile.userName,
          email: user.email,
          phoneNumber: user.userProfile.phoneNumber,
          sex: user.userProfile.sex,
          birthDate: user.userProfile.birthDate,
          address: user.userProfile.address,
        }))
      );
    };

    fetchData();
  }, []);

  return (
    <Box>
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={users}
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

export default User;
