import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { LoadingButton } from "@mui/lab";
import MuiAlert from "@mui/material/Alert";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Category_URL = "/api/Categories";

const Category = () => {
  const axiosPrivate = useAxiosPrivate();

  const [secondary, setSecondary] = React.useState(false);

  const [categories, setCategories] = React.useState([
    {
      level: 1,
      list: [],
    },
    {
      level: 2,
      list: [],
    },
    {
      level: 3,
      list: [],
    },
  ]);
  const [selectedList, setSelectedList] = React.useState([
    {
      level: 1,
      parentId: 0,
      id: 0,
      name: "",
      isSelect: false,
    },
    {
      level: 2,
      parentId: 0,
      id: 0,
      name: "",
      isSelect: false,
    },
    {
      level: 3,
      parentId: 0,
      id: 0,
      name: "",
      isSelect: false,
    },
  ]);

  const [openNewDialog, setOpenNewDialog] = React.useState(false);
  const [newItem, setNewItem] = React.useState({
    level: 0,
    name: "",
  });
  const [createLoading, setCreateLoading] = React.useState(false);

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [editItem, setEditItem] = React.useState({
    level: 0,
    id: 0,
    name: "",
  });
  const [editLoading, setEditLoading] = React.useState(false);

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleSnackbarOpen = (isSuccess, message) => {
    let severity = isSuccess ? "success" : "error";
    setSnackbar((prev) => ({
      ...prev,
      open: true,
      message: message,
      severity: severity,
    }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleNewDialogOpen = (level) => {
    setNewItem({ level: level, name: "" });
    setOpenNewDialog(true);
  };

  const handleNewDialogClose = () => {
    setOpenNewDialog(false);
  };

  const handleNewNameChange = (value) => {
    setNewItem((prevState) => ({
      ...prevState,
      name: value,
    }));
  };

  const create = async () => {
    setCreateLoading(true);

    let newObj = {
      ParentId:
        newItem.level === 1
          ? 0
          : selectedList.find((s) => s.level === newItem.level - 1)?.id,
      Level: newItem.level,
      Name: newItem.name,
    };
    // console.log(newObj);

    try {
      const response = await axiosPrivate.post(Category_URL, newObj);
      // console.log(response?.data);

      setCategories(
        categories.map((category) =>
          category.level === newItem.level
            ? { ...category, list: [...category.list, response?.data] }
            : { ...category }
        )
      );

      handleSnackbarOpen(true, "新增成功");
    } catch (error) {
      console.log(error);
      handleSnackbarOpen(false, "新增失敗");
    } finally {
      setOpenNewDialog(false);
      setCreateLoading(false);
    }
  };

  const handleEditDialogOpen = (item) => {
    setEditItem({ level: item.level, id: item.id, name: item.name });
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditNameChange = (value) => {
    setEditItem((prevState) => ({
      ...prevState,
      name: value,
    }));
  };

  const update = async () => {
    setEditLoading(true);

    let editObj = {
      Name: editItem.name,
    };

    try {
      await axiosPrivate.put(Category_URL + `/${editItem.id}`, editObj);

      setCategories(
        categories.map((category) =>
          category.level === editItem.level
            ? {
                ...category,
                list: category.list.map((item) =>
                  item.id === editItem.id
                    ? { ...item, name: editItem.name }
                    : { ...item }
                ),
              }
            : { ...category }
        )
      );

      setSelectedList(
        selectedList.map((selected) =>
          selected.level === editItem.level
            ? { ...selected, name: editItem.name }
            : { ...selected }
        )
      );

      handleSnackbarOpen(true, "更新成功");
    } catch (error) {
      console.log(error);
      handleSnackbarOpen(false, "更新失敗");
    } finally {
      setOpenEditDialog(false);
      setEditLoading(false);
    }
  };

  const deleteItem = async (level, id) => {
    try {
      await axiosPrivate.delete(Category_URL + `/${id}`);

      setCategories(
        categories.map((category) => {
          if (category.level === level) {
            return {
              ...category,
              list: category.list.filter((item) => item.id !== id),
            };
          } else if (category.level > level) {
            return {
              ...category,
              list: [],
            };
          } else {
            return {
              ...category,
            };
          }
        })
      );

      setSelectedList(
        selectedList.map((selected) => {
          if (selected.level >= level) {
            return {
              ...selected,
              parentId: 0,
              id: 0,
              name: "",
              isSelect: false,
            };
          } else {
            return { ...selected };
          }
        })
      );

      handleSnackbarOpen(true, "刪除成功");
    } catch (error) {
      console.log(error);
      handleSnackbarOpen(false, "刪除失敗");
    } finally {
      setOpenNewDialog(false);
      setCreateLoading(false);
    }
  };

  const handleSelect = async (level, data) => {
    // console.log(level);
    // console.log(data);

    let newcategories = [...categories].map((category) =>
      category.level > level ? { ...category, list: [] } : { ...category }
    );

    setSelectedList(
      selectedList.map((selected) => {
        if (selected.level === level) {
          return {
            ...selected,
            parentId: data.parentId,
            id: data.id,
            name: data.name,
            isSelect: true,
          };
        } else if (selected.level > level) {
          return {
            ...selected,
            parentId: 0,
            id: 0,
            name: "",
            isSelect: false,
          };
        } else {
          return { ...selected };
        }
      })
    );

    try {
      const response = await axiosPrivate.get(Category_URL + `/${data.id}`);
      // console.log(response?.data);

      setCategories(
        newcategories.map((category) =>
          category.level === level + 1
            ? { ...category, list: response?.data?.children }
            : { ...category }
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosPrivate.get(Category_URL, {
          params: { level: 1 },
        });
        // console.log(response?.data);
        setCategories(
          categories.map((category) =>
            category.level === 1
              ? { ...category, list: response?.data }
              : { ...category }
          )
        );
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <Box>
      <Box>
        <Box mb={2}>
          <p>
            已選擇: {selectedList.map((selected) => selected.name).join("/")}
          </p>
        </Box>
        <Grid container spacing={1} bgcolor="white">
          <Grid item xs={4}>
            <p>第一層</p>
            <Button variant="outlined" onClick={() => handleNewDialogOpen(1)}>
              新增
            </Button>
          </Grid>
          <Grid item xs={4}>
            <p>第二層</p>
            {selectedList[0].isSelect ? (
              <Button variant="outlined" onClick={() => handleNewDialogOpen(2)}>
                新增
              </Button>
            ) : null}
          </Grid>
          <Grid item xs={4}>
            <p>第三層</p>
            {selectedList[1].isSelect ? (
              <Button variant="outlined" onClick={() => handleNewDialogOpen(3)}>
                新增
              </Button>
            ) : null}
          </Grid>

          {categories.map((category) => (
            <Grid item xs={4} key={category.level}>
              <List dense sx={{ overflow: "auto", height: "inherit" }}>
                {category.list.map((item) => (
                  <ListItem
                    key={item.id}
                    secondaryAction={
                      <ListItemIcon>
                        <ListItemIcon>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditDialogOpen(item)}
                          >
                            <EditIcon />
                          </IconButton>
                        </ListItemIcon>
                        <ListItemIcon>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteItem(item.level, item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemIcon>
                      </ListItemIcon>
                    }
                  >
                    <ListItemButton
                      onClick={() => handleSelect(category.level, item)}
                    >
                      <ListItemText
                        primary={item.name}
                        secondary={secondary ? "Secondary text" : null}
                      />
                      {/* <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditDialogOpen(item)}
                        >
                          <EditIcon />
                        </IconButton>
                      </ListItemIcon>
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemIcon> */}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={openNewDialog}
        onClose={handleNewDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">新增</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="名稱"
            type="text"
            fullWidth
            variant="standard"
            value={newItem.name}
            onChange={(e) => handleNewNameChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={create}
            loading={createLoading}
            variant="outlined"
          >
            確定
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={handleEditDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">編輯</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="名稱"
            type="text"
            fullWidth
            variant="standard"
            value={editItem.name}
            onChange={(e) => handleEditNameChange(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={update}
            loading={editLoading}
            variant="outlined"
          >
            確定
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Category;
