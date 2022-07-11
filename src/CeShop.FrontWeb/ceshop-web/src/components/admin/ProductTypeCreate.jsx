import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
  Alert,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Paper,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const ProductType_URL = "/api/GoodsTypes";

const ProductTypeCreate = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [typeName, setTypeName] = React.useState("");
  const [attributes, setAttributes] = React.useState([]);
  const [specifications, setSpecifications] = React.useState([]);
  const [errMsg, setErrMsg] = React.useState("");
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

  const typeNameChange = (name) => {
    setTypeName(name);
  };

  const addAttribute = () => {
    setAttributes((prev) => [
      ...prev,
      { id: attributes.length + 1, name: "", options: [] },
    ]);
  };

  const removeAttribute = (id) => {
    setAttributes(attributes.filter((attribute) => attribute.id !== id));
  };

  const attributeNameChange = (id, name) => {
    setAttributes(
      attributes.map((attribute) =>
        attribute.id === id ? { ...attribute, name: name } : { ...attribute }
      )
    );
  };

  const addAttributeOption = (id) => {
    setAttributes(
      attributes.map((attribute) =>
        attribute.id === id
          ? {
              ...attribute,
              options: [
                ...attribute.options,
                { id: attribute.options.length + 1, name: "" },
              ],
            }
          : { ...attribute }
      )
    );
  };

  const removeAttributeOption = (attributeId, optionId) => {
    setAttributes(
      attributes.map((attribute) =>
        attribute.id === attributeId
          ? {
              ...attribute,
              options: attribute.options.filter(
                (option) => option.id !== optionId
              ),
            }
          : { ...attribute }
      )
    );
  };

  const attributeOptionNameChange = (attributeId, optionId, name) => {
    // console.log(attributeId, optionId, name);
    setAttributes(
      attributes.map((attribute) =>
        attribute.id === attributeId
          ? {
              ...attribute,
              options: attribute.options.map((option) =>
                option.id === optionId
                  ? { ...option, name: name }
                  : { ...option }
              ),
            }
          : { ...attribute }
      )
    );
  };

  const addSpecification = () => {
    setSpecifications((prev) => [
      ...prev,
      { id: specifications.length + 1, name: "", options: [] },
    ]);
  };

  const removeSpecification = (id) => {
    setSpecifications(
      specifications.filter((specification) => specification.id !== id)
    );
  };

  const specificationNameChange = (id, name) => {
    setSpecifications(
      specifications.map((specification) =>
        specification.id === id
          ? { ...specification, name: name }
          : { ...specification }
      )
    );
  };

  const addSpecificationOption = (id) => {
    setSpecifications(
      specifications.map((specification) =>
        specification.id === id
          ? {
              ...specification,
              options: [
                ...specification.options,
                { id: specification.options.length + 1, name: "" },
              ],
            }
          : { ...specification }
      )
    );
  };

  const removeSpecificationOption = (specificationId, optionId) => {
    setSpecifications(
      specifications.map((specification) =>
        specification.id === specificationId
          ? {
              ...specification,
              options: specification.options.filter(
                (option) => option.id !== optionId
              ),
            }
          : { ...specification }
      )
    );
  };

  const specificationOptionNameChange = (specificationId, optionId, name) => {
    // console.log(specificationId, optionId, name);
    setSpecifications(
      specifications.map((specification) =>
        specification.id === specificationId
          ? {
              ...specification,
              options: specification.options.map((option) =>
                option.id === optionId
                  ? { ...option, name: name }
                  : { ...option }
              ),
            }
          : { ...specification }
      )
    );
  };

  const create = async () => {
    // console.log(typeName);
    // console.log(attributes);
    // console.log(specifications);

    let newObj = {
      Name: typeName,
      TypeAttributes: attributes.map((attribute) => ({
        Name: attribute.name,
        TypeAttributeOptions: attribute.options.map((option) => ({
          value: option.name,
        })),
      })),
      TypeSpecifications: specifications.map((specification) => ({
        Name: specification?.name,
        TypeSpecificationOptions: specification?.options.map((option) => ({
          value: option.name,
        })),
      })),
    };

    try {
      await axiosPrivate.post(ProductType_URL, newObj);
      setOpenCreateDialog(true);
    } catch (error) {
      console.log(error);
      setErrMsg("服務錯誤");
    }
  };

  const handleOk = () => {
    navigate("/backstage/producttype");
  };

  return (
    <Box>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
        }}
        noValidate
        autoComplete="off"
        fullWidth
      >
        <Paper>
          <Box p={2}>
            <Typography variant="h6">商品類型名稱</Typography>
            <TextField
              id="outlined-basic"
              label=""
              variant="outlined"
              fullWidth
              value={typeName}
              onChange={(e) => typeNameChange(e.target.value)}
            />
          </Box>
        </Paper>

        <Box mb={3}>
          <Paper>
            <Box p={2}>
              <Typography variant="h6">屬性</Typography>
              <Box>
                {attributes.map((attribute) => (
                  <Box
                    sx={{
                      display: "flex",
                      padding: "10px",
                      // justifyContent: "center",
                      alignItems: "center",
                    }}
                    key={attribute.id}
                  >
                    <Box>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => removeAttribute(attribute.id)}
                      >
                        <ClearIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                    <Box>
                      <TextField
                        id="outlined-basic"
                        label="屬性名稱"
                        variant="outlined"
                        value={attribute.name}
                        onChange={(e) =>
                          attributeNameChange(attribute.id, e.target.value)
                        }
                      />
                    </Box>
                    <Box ml={1}>
                      <Stack>
                        {attribute.options.map((option) => (
                          <Box mb={1} key={option.id}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="outlined-basic"
                                label="選項名稱"
                                variant="outlined"
                                value={option.name}
                                onChange={(e) =>
                                  attributeOptionNameChange(
                                    attribute.id,
                                    option.id,
                                    e.target.value
                                  )
                                }
                              />
                              <Box ml={1}>
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  onClick={() =>
                                    removeAttributeOption(
                                      attribute.id,
                                      option.id
                                    )
                                  }
                                >
                                  <ClearIcon fontSize="inherit" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                        <Button
                          variant="outlined"
                          onClick={() => addAttributeOption(attribute.id)}
                        >
                          增加{attribute.name}選項
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box>
                <Button variant="outlined" onClick={() => addAttribute()}>
                  增加屬性
                </Button>
              </Box>
            </Box>
          </Paper>
          <Box mt={3}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">規格</Typography>
                <Box>
                  {specifications.map((specification) => (
                    <Box
                      sx={{
                        display: "flex",
                        padding: "10px",
                        // justifyContent: "center",
                        alignItems: "center",
                      }}
                      key={specification.id}
                    >
                      <Box>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={() => removeSpecification(specification.id)}
                        >
                          <ClearIcon fontSize="inherit" />
                        </IconButton>
                      </Box>
                      <Box>
                        <TextField
                          id="outlined-basic"
                          label="規格名稱"
                          variant="outlined"
                          value={specification.name}
                          onChange={(e) =>
                            specificationNameChange(
                              specification.id,
                              e.target.value
                            )
                          }
                        />
                      </Box>
                      <Box ml={1}>
                        <Stack>
                          {specification.options.map((option) => (
                            <Box mb={1} key={option.id}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  id="outlined-basic"
                                  label="選項名稱"
                                  variant="outlined"
                                  value={option.name}
                                  onChange={(e) =>
                                    specificationOptionNameChange(
                                      specification.id,
                                      option.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <Box ml={1}>
                                  <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={() =>
                                      removeSpecificationOption(
                                        specification.id,
                                        option.id
                                      )
                                    }
                                  >
                                    <ClearIcon fontSize="inherit" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                          <Button
                            variant="outlined"
                            onClick={() =>
                              addSpecificationOption(specification.id)
                            }
                          >
                            增加{specification.name}選項
                          </Button>
                        </Stack>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => addSpecification()}
                    disabled={specifications.length >= 2}
                  >
                    增加規格
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
        <Box pt={3}>
          <Box>
            <Button variant="contained" onClick={() => create()}>
              儲存
            </Button>
          </Box>
          {errMsg !== "" ? (
            <Box>
              <Alert severity="error">{errMsg}</Alert>
            </Box>
          ) : null}
        </Box>
      </Box>

      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={openCreateDialog}
      >
        <DialogTitle>提示</DialogTitle>
        <DialogContent dividers>
          <Typography variant="p">新增成功</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk}>確認</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductTypeCreate;
