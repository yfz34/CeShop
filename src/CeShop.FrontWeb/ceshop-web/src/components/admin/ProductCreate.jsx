import React from "react";
import NumberFormat from "react-number-format";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { forwardRef, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import axios from "../../api/axios";

const Input = styled("input")({
  display: "none",
});

const Category_URL = "/api/Categories";
const UPLOAD_IMAGE_URL = "/api/images";
const GoodsTypes_URL = "/api/GoodsTypes";
const Goods_URL = "/api/Goods";

const SPEC_DATA = {
  id: 1,
  name: "",
  options: [],
};

const SPEC_OPTION_DATA = {
  id: 1,
  name: "",
};

const IMAGE_DATA = {
  id: 0,
  name: "",
  url: "",
  file: null,
};

const CreateSpecData = () => {
  return [
    {
      ...SPEC_DATA,
      options: [SPEC_OPTION_DATA],
    },
  ];
};

const CreateOtherImageData = () => {
  let result = [];
  for (let index = 1; index <= 4; index++) {
    result.push({
      ...IMAGE_DATA,
      id: index,
      name: "Image" + index.toString(),
    });
  }
  return result;
};

const NumberFormatCustom = forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
});

const ProductCreate = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [createLoading, setCreateLoading] = React.useState(false);

  const [name, setName] = React.useState("");

  const [categoryLevel1, setCategoryLevel1] = React.useState([]);
  const [categoryLevel2, setCategoryLevel2] = React.useState([]);
  const [categoryLevel3, setCategoryLevel3] = React.useState([]);

  const [selectedCategoryLevel1, setSelectedCategoryLevel1] =
    React.useState("");
  const [selectedCategoryLevel2, setSelectedCategoryLevel2] =
    React.useState("");
  const [selectedCategoryLevel3, setSelectedCategoryLevel3] =
    React.useState("");

  const [description, setDescription] = React.useState("");

  const [goodsTypes, setGoodsTypes] = React.useState([]);
  const [selectedGoodsTypes, setSelectedGoodsTypes] = React.useState("");

  const [attributes, setAttributes] = React.useState([]);

  const [code, setCode] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const [openSpec, setOpenSpec] = React.useState(false);
  const [spec1, setSpec1] = React.useState({
    name: "",
    options: [
      {
        id: 1,
        name: "",
        url: "",
        file: null,
      },
    ],
  });
  const [openSpec2, setOpenSpec2] = React.useState(false);
  const [spec2, setSpec2] = React.useState({
    name: "",
    options: [
      {
        id: 1,
        name: "",
        url: "",
        file: null,
      },
    ],
  });

  const [applyPrice, setApplyPrice] = React.useState(0);
  const [applyCount, setApplyCount] = React.useState(0);
  const [applyCode, setApplyCode] = React.useState("");

  const [specTableRows, setSpecTableRows] = React.useState([
    {
      id: 1,
      spec1OptionId: 1,
      spec1OptionName: "",
      spec2OptionId: 1,
      spec2OptionName: "",
      price: 0,
      count: 0,
      code: "",
    },
  ]);

  const [mainImage, setMainImage] = useState(IMAGE_DATA);

  const [otherImages, setOtherImages] = useState(CreateOtherImageData());

  const [openCreateHintDialog, setOpenCreateHintDialog] = useState(false);
  const [createHintMessage, setCreateHintMessage] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleCreateHint = () => {
    if (createSuccess) {
      navigate("/backstage/product");
    }
    setOpenCreateHintDialog(false);
  };

  const handleCodeChange = (value) => {
    setCode(value);
    setApplyCode(value);
  };

  const handlePriceChange = (value) => {
    setPrice(value);
    setApplyPrice(value);
  };

  const handleCategoryLevel1Change = async (value) => {
    setSelectedCategoryLevel1(value);
    setSelectedCategoryLevel2("");
    setSelectedCategoryLevel3("");

    let level2 = [];
    setCategoryLevel3([]);

    if (value === "") {
      setCategoryLevel2(level2);
      return;
    }

    try {
      const response = await getCategoriesById(value);
      level2 = response.data?.children;
    } catch (error) {
      console.error(error);
    } finally {
      setCategoryLevel2(level2);
    }
  };

  const handleCategoryLevel2Change = async (value) => {
    setSelectedCategoryLevel2(value);
    setSelectedCategoryLevel3("");

    let level3 = [];

    if (value === "") {
      setCategoryLevel3(level3);
      return;
    }

    try {
      const response = await getCategoriesById(value);
      level3 = response.data?.children;
    } catch (error) {
      console.error(error);
    } finally {
      setCategoryLevel3(level3);
    }
  };

  const handleCategoryLevel3Change = async (value) => {
    setSelectedCategoryLevel3(value);
  };

  const handleSpec1NameChange = async (value) => {
    setSpec1((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const addSpec1Option = () => {
    let newOptionId = spec1.options.length + 1;
    let newSpec1Options = spec1.options;
    newSpec1Options.push({
      id: newOptionId,
      name: "",
      url: "",
      file: null,
    });
    setSpec1((prev) => ({
      ...prev,
      options: newSpec1Options,
    }));
    handleSpecTableRowsCombine(newSpec1Options, spec2.options);
  };

  const handleSpec1OptionNameChange = (id, value) => {
    setSpec1((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === id ? { ...option, name: value } : { ...option }
      ),
    }));
    handleSpecTableRowsSpec1OptionChange(id, value);
  };

  const removeSpec1Option = (id) => {
    let newOptions = spec1.options.filter((option) => option.id !== id);

    setSpec1((prev) => ({
      ...prev,
      options: newOptions,
    }));

    handleSpecTableRowsCombine(newOptions, spec2.options);
  };

  const removeSpec1 = () => {
    if (openSpec2) {
      setSpec1(spec2);
      setOpenSpec2(false);
      let newSpec1Options = spec2.options;
      let newSpec2Options = [
        {
          id: 1,
          name: "",
          url: "",
          file: null,
        },
      ];
      setSpec2({
        name: "",
        options: newSpec2Options,
      });
      handleSpecTableRowsCombine(newSpec1Options, newSpec2Options);
    } else {
      setOpenSpec(false);
      setSpec1({
        name: "",
        options: [
          {
            id: 1,
            name: "",
            url: "",
            file: null,
          },
        ],
      });
      setSpecTableRows([
        {
          id: 1,
          spec1OptionId: 1,
          spec1OptionName: "",
          spec2OptionId: 1,
          spec2OptionName: "",
          price: 0,
          count: 0,
          code: "",
        },
      ]);
    }
  };

  const handleSpec2NameChange = async (value) => {
    setSpec2((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const addSpec2Option = () => {
    let newOptionId = spec2.options.length + 1;
    let newSpec2Options = spec2.options;
    newSpec2Options.push({
      id: newOptionId,
      name: "",
      url: "",
      file: null,
    });
    setSpec2((prev) => ({
      ...prev,
      options: newSpec2Options,
    }));
    handleSpecTableRowsCombine(spec1.options, newSpec2Options);
  };

  const handleSpec2OptionNameChange = (id, value) => {
    setSpec2((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === id ? { ...option, name: value } : { ...option }
      ),
    }));
    handleSpecTableRowsSpec2OptionChange(id, value);
  };

  const removeSpec2Option = (id) => {
    let newOptions = spec2.options.filter((option) => option.id !== id);

    setSpec2((prev) => ({
      ...prev,
      options: newOptions,
    }));

    handleSpecTableRowsCombine(spec1.options, newOptions);
  };

  const removeSpec2 = () => {
    setOpenSpec2(false);
    let newSpec2Options = [
      {
        id: 1,
        name: "",
      },
    ];
    setSpec2({
      name: "",
      options: newSpec2Options,
    });
    handleSpecTableRowsCombine(spec1.options, newSpec2Options);
  };

  const handleSpecTableRowsCombine = (spec1Options, spec2Options) => {
    let rows = [];
    let index = 1;
    for (let i = 0; i < spec1Options.length; i++) {
      const spec1Option = spec1Options[i];
      for (let j = 0; j < spec2Options.length; j++) {
        const spec2Option = spec2Options[j];
        rows.push({
          id: index,
          spec1OptionId: spec1Option.id,
          spec1OptionName: spec1Option.name,
          spec2OptionId: spec2Option.id,
          spec2OptionName: spec2Option.name,
          price: 0,
          count: 0,
          code: "",
        });
        index += 1;
      }
    }
    console.log(rows);
    setSpecTableRows(rows);
  };

  const handleSpecTableRowsSpec1OptionChange = (id, value) => {
    setSpecTableRows(
      specTableRows.map((row) =>
        row.spec1OptionId === id
          ? { ...row, spec1OptionName: value }
          : { ...row }
      )
    );
  };

  const handleSpecTableRowsSpec2OptionChange = (id, value) => {
    setSpecTableRows(
      specTableRows.map((row) =>
        row.spec2OptionId === id
          ? { ...row, spec2OptionName: value }
          : { ...row }
      )
    );
  };

  const handleSpecTableRowsPriceChange = (id, value) => {
    setSpecTableRows(
      specTableRows.map((row) =>
        row.id === id ? { ...row, price: value } : { ...row }
      )
    );
  };

  const handleSpecTableRowsCountChange = (id, value) => {
    setSpecTableRows(
      specTableRows.map((row) =>
        row.id === id ? { ...row, count: value } : { ...row }
      )
    );
  };

  const handleSpecTableRowsCodeChange = (id, value) => {
    setSpecTableRows(
      specTableRows.map((row) =>
        row.id === id ? { ...row, code: value } : { ...row }
      )
    );
  };

  const applySpecTableRows = () => {
    setSpecTableRows(
      specTableRows.map((row, index) => ({
        ...row,
        price: applyPrice,
        count: applyCount,
        code:
          applyCode === ""
            ? ""
            : applyCode + "-" + (index + 1).toString().padStart(3, "0"),
      }))
    );
  };

  const mainImageUpload = async () => {
    if (mainImage.url === "") {
      return "";
    }

    let formData = new FormData();
    formData.append("file", mainImage.file);
    try {
      const response = await axios.post(UPLOAD_IMAGE_URL, formData);
      return response?.data[0];
    } catch (error) {
      console.log(error);
    }
  };

  const otherImageUpload = async () => {
    let formData = new FormData();

    let hasFile = false;
    for (let index = 0; index < otherImages.length; index++) {
      const otherImage = otherImages[index];
      if (otherImage.url !== "") {
        hasFile = true;
        formData.append("file", otherImage.file);
      }
    }

    if (!hasFile) {
      return [];
    }

    const response = await axiosPrivate.post(UPLOAD_IMAGE_URL, formData);

    let result = [];
    let dataCount = 0;
    for (let index = 0; index < otherImages.length; index++) {
      const otherImage = otherImages[index];
      if (otherImage.url !== "") {
        result.push(response.data[dataCount]);
      } else {
        result.push("");
      }
      dataCount++;
    }

    return result;
  };

  const spec1ImageUpload = async () => {
    if (!openSpec) {
      return [];
    }
    let result = spec1.options.map(() => "");
    let formData = new FormData();
    let hasFile = false;
    for (let index = 0; index < spec1.options.length; index++) {
      const option = spec1.options[index];
      if (option.file !== null) {
        hasFile = true;
        formData.append("file", option.file);
      }
    }
    if (!hasFile) {
      return result;
    }
    const response = await axiosPrivate.post(UPLOAD_IMAGE_URL, formData);

    let dataCount = 0;
    for (let index = 0; index < spec1.options.length; index++) {
      const option = spec1.options[index];
      if (option.url !== "") {
        result[index] = response.data[dataCount];
      }
      dataCount++;
    }

    return result;
  };

  const spec2ImageUpload = async () => {
    if (!openSpec2) {
      return [];
    }
    let result = spec2.options.map(() => "");
    let formData = new FormData();
    let hasFile = false;
    for (let index = 0; index < spec2.options.length; index++) {
      const option = spec2.options[index];
      if (option.file !== null) {
        hasFile = true;
        formData.append("file", option.file);
      }
    }
    if (!hasFile) {
      return result;
    }
    const response = await axiosPrivate.post(UPLOAD_IMAGE_URL, formData);

    let dataCount = 0;
    for (let index = 0; index < spec2.options.length; index++) {
      const option = spec2.options[index];
      if (option.url !== "") {
        result[index] = response.data[dataCount];
      }
      dataCount++;
    }

    return result;
  };

  const handleSave = async () => {
    setCreateLoading(true);

    // check data
    let errMsg = "";
    if (mainImage.url === "") {
      errMsg = "請選擇主要商品照片";
    }

    if (name === "") {
      errMsg = "請輸入商品名稱";
    }

    if (errMsg !== "") {
      setOpenCreateHintDialog(true);
      setCreateHintMessage(errMsg);
      setCreateLoading(false);
      return;
    }

    let obj = {};

    try {
      let m = await mainImageUpload();
      let o = await otherImageUpload();
      let s1 = await spec1ImageUpload();
      let s2 = await spec2ImageUpload();

      let goodsSpecifications = [];
      if (openSpec) {
        goodsSpecifications.push({
          name: spec1.name,
          goodsSpecificationOptions: spec1.options.map((option, index) => ({
            name: option.name,
            pictureName: option.url === "" ? "" : s1[index],
          })),
        });
        if (openSpec2) {
          goodsSpecifications.push({
            name: spec2.name,
            goodsSpecificationOptions: spec2.options.map((option, index) => ({
              name: option.name,
              pictureName: option.url === "" ? "" : s2[index],
            })),
          });
        }
      }

      console.log(attributes);
      let goodsAttributes = attributes.map((attribute) => ({
        name: attribute.name,
        value: attribute.typeAttributeOptions.find(
          (o) => o.id === attribute.selected
        )?.value,
      }));
      console.log(goodsAttributes);

      let pictures = [m, ...o];

      let goodsSkus = [];
      let quantity = 0;
      if (!openSpec) {
        goodsSkus.push({
          code: code + "-001",
          price: price,
          status: 1,
          quantity: count,
          goodsSkuSpecifications: [],
        });
        quantity = count;
      } else {
        goodsSkus = specTableRows.map((row) => {
          let goodsSkuSpecifications = [];
          if (openSpec) {
            goodsSkuSpecifications.push({
              name: spec1.name,
              value: row.spec1OptionName,
            });

            if (openSpec2) {
              goodsSkuSpecifications.push({
                name: spec2.name,
                value: row.spec2OptionName,
              });
            }
          }

          quantity += parseInt(row.count);

          return {
            code: row.code,
            price: row.price,
            quantity: row.count,
            status: 1,
            goodsSkuSpecifications: goodsSkuSpecifications,
          };
        });
      }

      obj = {
        code: code,
        name: name,
        description: description,
        status: 1,
        unit: "件",
        price: price,
        stock: quantity,
        mainPicture: m,
        categoryLevel1Id:
          selectedCategoryLevel1 === "" ? null : selectedCategoryLevel1,
        categoryLevel2Id:
          selectedCategoryLevel2 === "" ? null : selectedCategoryLevel2,
        categoryLevel3Id:
          selectedCategoryLevel3 === "" ? null : selectedCategoryLevel3,
        goodsTypeId: selectedGoodsTypes === "" ? null : selectedGoodsTypes,
        goodsSpecifications: goodsSpecifications,
        goodsAttributes: goodsAttributes,
        pictures: pictures,
        goodsSkus: goodsSkus,
      };
    } catch (error) {
      console.error(error);
      setOpenCreateHintDialog(true);
      setCreateHintMessage("資料錯誤");
      setCreateLoading(false);
    }

    axiosPrivate
      .post(Goods_URL, obj)
      .then(() => {
        setOpenCreateHintDialog(true);
        setCreateHintMessage("新增成功");
        setCreateSuccess(true);
      })
      .catch((err) => {
        console.error(err);
        setOpenCreateHintDialog(true);
        setCreateHintMessage("服務錯誤");
        setCreateLoading(false);
      });
  };

  const selectMainImageFileChange = (event) => {
    let file = event.target.files[0];
    setMainImage({
      url: URL.createObjectURL(file),
      file: file,
    });
  };

  const removeMainImageFile = () => {
    setMainImage({
      url: "",
      file: null,
    });
  };

  const selectOtherImageFileChange = (event) => {
    let files = [...event.target.files];
    let filesIndex = 0;
    let newOtherImages = otherImages.map((otherImage) => {
      if (otherImage.url !== "") {
        return { ...otherImage };
      } else if (files.length > filesIndex) {
        let file = files[filesIndex];
        filesIndex += 1;
        return { ...otherImage, url: URL.createObjectURL(file), file: file };
      } else {
        return { ...otherImage };
      }
    });

    setOtherImages(newOtherImages);
  };

  const removeOtherImageFile = (id) => {
    setOtherImages(
      otherImages.map((otherImage) =>
        otherImage.id === id
          ? { ...otherImage, url: "", file: null }
          : { ...otherImage }
      )
    );
  };

  const selectSpec1OptionImageFileChange = (event) => {
    let files = [...event.target.files];
    let filesIndex = 0;
    let newSpec1Option = spec1.options.map((option) => {
      if (option.url !== "") {
        return { ...option };
      } else if (files.length > filesIndex) {
        let file = files[filesIndex];
        filesIndex += 1;
        return { ...option, url: URL.createObjectURL(file), file: file };
      } else {
        return { ...option };
      }
    });

    setSpec1((prev) => ({ ...prev, options: newSpec1Option }));
  };

  const removeSpec1OptionImageFile = (id) => {
    let options = spec1.options.map((option) =>
      option.id === id ? { ...option, url: "", file: null } : { ...option }
    );

    setSpec1((prev) => ({ ...prev, options: options }));
  };

  const selectSpec2OptionImageFileChange = (event) => {
    let files = [...event.target.files];
    let filesIndex = 0;
    let newSpec2Option = spec2.options.map((option) => {
      if (option.url !== "") {
        return { ...option };
      } else if (files.length > filesIndex) {
        let file = files[filesIndex];
        filesIndex += 1;
        return { ...option, url: URL.createObjectURL(file), file: file };
      } else {
        return { ...option };
      }
    });

    setSpec2((prev) => ({ ...prev, options: newSpec2Option }));
  };

  const removeSpec2OptionImageFile = (id) => {
    let options = spec2.options.map((option) =>
      option.id === id ? { ...option, url: "", file: null } : { ...option }
    );

    setSpec2((prev) => ({ ...prev, options: options }));
  };

  const handleGoodsTypesChange = async (value) => {
    setSelectedGoodsTypes(value);
    console.log(value);
    let r = await getGoodsTypesDetail(value);

    let newAttributes = r.data.typeAttributes.map((attribute) => ({
      ...attribute,
      selected: "",
    }));

    setAttributes(newAttributes);

    if (r.data.typeSpecifications.length > 0) {
      let item = r.data.typeSpecifications[0];

      let newSpec1Options = item.typeSpecificationOptions.map(
        (option, index) => ({
          id: index + 1,
          name: option.value,
          url: "",
          file: null,
        })
      );

      setSpec1({
        name: item.name,
        options: newSpec1Options,
      });
      setOpenSpec(true);

      let newSpec2Options = spec2.options;

      if (r.data.typeSpecifications.length > 1) {
        let item2 = r.data.typeSpecifications[1];

        newSpec2Options = item2.typeSpecificationOptions.map(
          (option, index) => ({
            id: index + 1,
            name: option.value,
            url: "",
            file: null,
          })
        );

        setSpec2({
          name: item2.name,
          options: newSpec2Options,
        });
        setOpenSpec2(true);
      }

      handleSpecTableRowsCombine(newSpec1Options, newSpec2Options);
    }
  };

  const handleGoodsTypesOptionChange = async (id, value) => {
    setAttributes((prev) =>
      attributes.map((attribute) =>
        attribute.id === id
          ? { ...attribute, selected: value }
          : { ...attribute }
      )
    );
  };

  const getGoodsTypes = async () => await axiosPrivate.get(GoodsTypes_URL);
  const getGoodsTypesDetail = async (id) =>
    await axiosPrivate.get(GoodsTypes_URL + `/${id}`);

  const getCategories = async (level) =>
    await axiosPrivate.get(Category_URL, {
      params: { level: level },
    });

  const getCategoriesById = async (id) =>
    await axiosPrivate.get(Category_URL + `/${id}`);

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategories(1);
        setCategoryLevel1(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchGoodsTypes() {
      try {
        const response = await getGoodsTypes();
        setGoodsTypes(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
    fetchGoodsTypes();
  }, []);

  return (
    <Box sx={{ display: "block" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex" }}>
          <IconButton
            aria-label="返回"
            onClick={() => navigate("/backstage/product")}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h4">新增商品</Typography>
        </Box>
      </Box>

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
              <Box>
                <Typography variant="h5">基本資訊</Typography>
              </Box>

              <Box mt={3}>
                <Box mb={3}>
                  <TextField
                    label="商品名稱"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="h6">類別</Typography>
                  <Box fullWidth sx={{ display: "flex" }}>
                    <FormControl sx={{ flex: 1, m: 1 }}>
                      <InputLabel id="category-level1-label">第一層</InputLabel>
                      <Select
                        labelId="category-level1-label"
                        id="category-level1-select"
                        value={selectedCategoryLevel1}
                        label="第一層"
                        onChange={(e) =>
                          handleCategoryLevel1Change(e.target.value)
                        }
                      >
                        <MenuItem value={""}>
                          <em>無</em>
                        </MenuItem>
                        {categoryLevel1.map((category) => (
                          <MenuItem value={category.id} key={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ flex: 1, m: 1 }}>
                      <InputLabel id="category-level2-label">第二層</InputLabel>
                      <Select
                        labelId="category-level2-label"
                        id="category-level2-select"
                        value={selectedCategoryLevel2}
                        label="第二層"
                        onChange={(e) =>
                          handleCategoryLevel2Change(e.target.value)
                        }
                      >
                        <MenuItem value={""}>
                          <em>無</em>
                        </MenuItem>
                        {categoryLevel2.map((category) => (
                          <MenuItem value={category.id} key={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ flex: 1, m: 1 }}>
                      <InputLabel id="category-level3-label">第三層</InputLabel>
                      <Select
                        labelId="category-level3-label"
                        id="category-level3-select"
                        value={selectedCategoryLevel3}
                        label="第三層"
                        onChange={(e) =>
                          handleCategoryLevel3Change(e.target.value)
                        }
                      >
                        <MenuItem value={""}>
                          <em>無</em>
                        </MenuItem>
                        {categoryLevel3.map((category) => (
                          <MenuItem value={category.id} key={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Box mb={3}>
                  <TextareaAutosize
                    aria-label="product detail textarea"
                    placeholder="商品描述"
                    style={{ height: 200, width: "100%", overflow: "scroll" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Box>

                <Box mb={3} fullWidth>
                  <FormControl fullWidth>
                    <InputLabel id="goods-type-label">商品類型</InputLabel>
                    <Select
                      labelId="goods-type-label"
                      id="goods-type-select"
                      value={selectedGoodsTypes}
                      label="商品類型"
                      onChange={(e) => handleGoodsTypesChange(e.target.value)}
                    >
                      <MenuItem value={""}>
                        <em>無</em>
                      </MenuItem>
                      {goodsTypes.map((goodsType) => (
                        <MenuItem value={goodsType.id} key={goodsType.id}>
                          {goodsType.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {selectedGoodsTypes === "" ? null : (
                  <Box mb={3}>
                    <Stack>
                      {attributes.map((attribute) => (
                        <Box
                          m={2}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                          key={attribute.id}
                        >
                          <Box sx={{ flex: 1, textAlign: "right" }}>
                            <Typography variant="p">
                              {attribute.name}
                            </Typography>
                          </Box>
                          <Box Box sx={{ flex: 6, padding: "0 30px" }}>
                            <FormControl fullWidth>
                              <Select
                                value={attribute.selected}
                                onChange={(e) =>
                                  handleGoodsTypesOptionChange(
                                    attribute.id,
                                    e.target.value
                                  )
                                }
                              >
                                <MenuItem value={""}>
                                  <em>無</em>
                                </MenuItem>
                                {attribute.typeAttributeOptions.map(
                                  (option) => (
                                    <MenuItem value={option.id} key={option.id}>
                                      {option.value}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Box>
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
                <Box sx={{ flex: 6, padding: "0 30px" }}>
                  <TextField
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    variant="outlined"
                  />
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
                  <Typography variant="p">價格</Typography>
                </Box>
                <Box sx={{ flex: 6, padding: "0 30px" }}>
                  <TextField
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Stack>
            {!openSpec ? (
              <Stack>
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
                    <TextField
                      variant="outlined"
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                    />
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
                    <Typography variant="p">規格</Typography>
                  </Box>
                  <Box sx={{ flex: 6, padding: "0 30px" }}>
                    <Button
                      variant="contained"
                      onClick={() => setOpenSpec(true)}
                    >
                      開啟商品規格
                    </Button>
                  </Box>
                </Box>
              </Stack>
            ) : (
              <Stack>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "top",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">規格一</Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 6,
                      margin: "0 30px",
                      backgroundColor: "#f3eeee",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "-15px",
                        right: "-15px",
                      }}
                    >
                      <IconButton
                        aria-label="clear"
                        size="small"
                        sx={{
                          backgroundColor: "black",
                          color: "white",
                          "&:hover, &.Mui-focusVisible": {
                            backgroundColor: "gray",
                          },
                        }}
                        onClick={() => removeSpec1()}
                      >
                        <ClearIcon fontSize="inherit" />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                      }}
                    >
                      <Box sx={{ flex: 1, textAlign: "right" }}>
                        <Typography variant="p">商品選項名稱</Typography>
                      </Box>
                      <Box sx={{ flex: 6, padding: "0 30px" }}>
                        <TextField
                          variant="outlined"
                          value={spec1.name}
                          onChange={(e) =>
                            handleSpec1NameChange(e.target.value)
                          }
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "top",
                        padding: "10px 0",
                      }}
                    >
                      <Box sx={{ flex: 1, textAlign: "right" }}>
                        <Typography variant="p">選項</Typography>
                      </Box>
                      <Stack sx={{ flex: 6, padding: "0 30px" }}>
                        {spec1.options.map((option) => (
                          <Box
                            mb={2}
                            key={option.id}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              variant="outlined"
                              value={option.name}
                              onChange={(e) =>
                                handleSpec1OptionNameChange(
                                  option.id,
                                  e.target.value
                                )
                              }
                            />
                            <IconButton
                              aria-label="delete"
                              onClick={() => removeSpec1Option(option.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}

                        <Box>
                          <Button
                            variant="outlined"
                            onClick={() => addSpec1Option()}
                          >
                            增加選項
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "top",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">規格二</Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 6,
                      margin: "0 30px",
                      position: "relative",
                    }}
                  >
                    {openSpec2 ? (
                      <Box sx={{ backgroundColor: "#f3eeee" }}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "-15px",
                            right: "-15px",
                          }}
                        >
                          <IconButton
                            aria-label="clear"
                            size="small"
                            sx={{
                              backgroundColor: "black",
                              color: "white",
                              "&:hover, &.Mui-focusVisible": {
                                backgroundColor: "gray",
                              },
                            }}
                            onClick={() => removeSpec2()}
                          >
                            <ClearIcon fontSize="inherit" />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 0",
                          }}
                        >
                          <Box sx={{ flex: 1, textAlign: "right" }}>
                            <Typography variant="p">商品選項名稱</Typography>
                          </Box>
                          <Box sx={{ flex: 6, padding: "0 30px" }}>
                            <TextField
                              variant="outlined"
                              value={spec2.name}
                              onChange={(e) =>
                                handleSpec2NameChange(e.target.value)
                              }
                            />
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "top",
                            padding: "10px 0",
                          }}
                        >
                          <Box sx={{ flex: 1, textAlign: "right" }}>
                            <Typography variant="p">選項</Typography>
                          </Box>
                          <Stack sx={{ flex: 6, padding: "0 30px" }}>
                            {spec2.options.map((option) => (
                              <Box
                                mb={2}
                                key={option.id}
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <TextField
                                  variant="outlined"
                                  value={option.name}
                                  onChange={(e) =>
                                    handleSpec2OptionNameChange(
                                      option.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => removeSpec2Option(option.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            ))}

                            <Box>
                              <Button
                                variant="outlined"
                                onClick={() => addSpec2Option()}
                              >
                                增加選項
                              </Button>
                            </Box>
                          </Stack>
                        </Box>
                      </Box>
                    ) : (
                      <Box fullWidth>
                        <Button
                          variant="outlined"
                          onClick={() => setOpenSpec2(true)}
                        >
                          新增
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "top",
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography variant="p">規格資訊</Typography>
                  </Box>
                  <Box sx={{ flex: 6, margin: "0 30px" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TextField
                        label="價格"
                        variant="outlined"
                        value={applyPrice}
                        onChange={(e) => setApplyPrice(e.target.value)}
                        name="allprice"
                        id="allprice"
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                      />

                      <TextField
                        label="商品數量"
                        variant="outlined"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={applyCount}
                        onChange={(e) => setApplyCount(e.target.value)}
                      />

                      <TextField
                        variant="outlined"
                        label="商品選項貨號"
                        value={applyCode}
                        onChange={(e) => setApplyCode(e.target.value)}
                      />
                      <Button
                        size="large"
                        variant="contained"
                        onClick={() => applySpecTableRows()}
                      >
                        全部套用
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box
                  m={2}
                  sx={{
                    display: "flex",
                    alignItems: "top",
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
                            {openSpec ? (
                              <TableCell align="center">
                                {spec1.name === "" ? "規格一名稱" : spec1.name}
                              </TableCell>
                            ) : null}
                            {openSpec2 ? (
                              <TableCell align="center">
                                {spec2.name === "" ? "規格二名稱" : spec2.name}
                              </TableCell>
                            ) : null}

                            <TableCell align="center">價格</TableCell>
                            <TableCell align="center">商品數量</TableCell>
                            <TableCell align="center">商品選項貨號</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {specTableRows.map((row) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                                sx={{ width: "150px" }}
                              >
                                {row.spec1OptionName}
                              </TableCell>

                              {openSpec2 ? (
                                <TableCell
                                  align="center"
                                  sx={{ width: "150px" }}
                                >
                                  {row.spec2OptionName}
                                </TableCell>
                              ) : null}

                              <TableCell align="center" sx={{ width: "150px" }}>
                                <TextField
                                  variant="outlined"
                                  value={row.price}
                                  onChange={(e) =>
                                    handleSpecTableRowsPriceChange(
                                      row.id,
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    inputComponent: NumberFormatCustom,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center" sx={{ width: "150px" }}>
                                <TextField
                                  variant="outlined"
                                  value={row.count}
                                  onChange={(e) =>
                                    handleSpecTableRowsCountChange(
                                      row.id,
                                      e.target.value
                                    )
                                  }
                                  type="number"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center" sx={{ width: "150px" }}>
                                <TextField
                                  variant="outlined"
                                  value={row.code}
                                  onChange={(e) =>
                                    handleSpecTableRowsCodeChange(
                                      row.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </Stack>
            )}
          </Paper>

          <Paper elevation={1}>
            <Box m={2}>
              <Box mb={2}>
                <Typography variant="h5">照片管理</Typography>
              </Box>
              <Box>
                <Typography component={"p"}>主要商品照片</Typography>
              </Box>
              <Box fullWidth>
                <Box sx={{ display: "flex" }}>
                  <Box
                    p={1}
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
                      {mainImage.url === "" ? (
                        <label htmlFor="contained-button-file">
                          <Input
                            accept="image/*"
                            id="contained-button-file"
                            type="file"
                            onChange={(e) => selectMainImageFileChange(e)}
                          />
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",

                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <AddCircleOutlineIcon />
                          </Box>
                        </label>
                      ) : (
                        <>
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              // backgroundImage: `url(${mainImage.url})`,
                              // backgroundRepeat: "no-repeat",
                            }}
                          >
                            <img
                              src={mainImage.url}
                              alt=""
                              width={"80%"}
                              height={"80%"}
                            />
                          </Box>
                          <Box
                            sx={{
                              position: "absolute",
                              top: "-15px",
                              right: "-15px",
                            }}
                          >
                            <IconButton
                              aria-label="clear"
                              size="small"
                              sx={{
                                backgroundColor: "black",
                                color: "white",
                                "&:hover, &.Mui-focusVisible": {
                                  backgroundColor: "gray",
                                },
                              }}
                              onClick={() => removeMainImageFile()}
                            >
                              <ClearIcon fontSize="inherit" />
                            </IconButton>
                          </Box>
                        </>
                      )}
                    </Box>

                    <Box textAlign={"center"}>
                      <Typography variant="p" component={"p"}>
                        封面照片
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography component={"p"}>其他商品照片</Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap" }} fullWidth>
                {otherImages.map((otherImage) => (
                  <Box key={otherImage.id}>
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
                        {otherImage.url === "" ? (
                          <label
                            htmlFor={"contained-button-file-" + otherImage.id}
                          >
                            <Input
                              accept="image/*"
                              id={"contained-button-file-" + otherImage.id}
                              type="file"
                              multiple
                              onChange={(e) => selectOtherImageFileChange(e)}
                            />
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <AddCircleOutlineIcon />
                            </Box>
                          </label>
                        ) : (
                          <>
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
                                src={otherImage.url}
                                alt=""
                                width={"80%"}
                                height={"80%"}
                              />
                            </Box>
                            <Box
                              sx={{
                                position: "absolute",
                                top: "-15px",
                                right: "-15px",
                              }}
                            >
                              <IconButton
                                aria-label="clear"
                                size="small"
                                sx={{
                                  backgroundColor: "black",
                                  color: "white",
                                  "&:hover, &.Mui-focusVisible": {
                                    backgroundColor: "gray",
                                  },
                                }}
                                onClick={() =>
                                  removeOtherImageFile(otherImage.id)
                                }
                              >
                                <ClearIcon fontSize="inherit" />
                              </IconButton>
                            </Box>
                          </>
                        )}
                      </Box>

                      <Box textAlign={"center"}>
                        <Typography variant="p" component={"p"}>
                          {otherImage.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              {openSpec ? (
                <Box>
                  <Box>
                    <Typography component={"p"}>
                      {spec1.name === "" ? "規格一名稱" : spec1.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }} fullWidth>
                    {spec1.options.map((option) => (
                      <Box key={option.id}>
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
                            {option.url === "" ? (
                              <label
                                htmlFor={"spec1option-button-file-" + option.id}
                              >
                                <Input
                                  accept="image/*"
                                  id={"spec1option-button-file-" + option.id}
                                  type="file"
                                  multiple
                                  onChange={(e) =>
                                    selectSpec1OptionImageFileChange(e)
                                  }
                                />
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: "100%",

                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <AddCircleOutlineIcon />
                                </Box>
                              </label>
                            ) : (
                              <>
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
                                    src={option.url}
                                    alt=""
                                    width={"80%"}
                                    height={"80%"}
                                  />
                                </Box>
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "-15px",
                                    right: "-15px",
                                  }}
                                >
                                  <IconButton
                                    aria-label="clear"
                                    size="small"
                                    sx={{
                                      backgroundColor: "black",
                                      color: "white",
                                      "&:hover, &.Mui-focusVisible": {
                                        backgroundColor: "gray",
                                      },
                                    }}
                                    onClick={() =>
                                      removeSpec1OptionImageFile(option.id)
                                    }
                                  >
                                    <ClearIcon fontSize="inherit" />
                                  </IconButton>
                                </Box>
                              </>
                            )}
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
              ) : null}
              {openSpec2 ? (
                <Box>
                  <Box>
                    <Typography component={"p"}>
                      {spec2.name === "" ? "規格二名稱" : spec2.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }} fullWidth>
                    {spec2.options.map((option) => (
                      <Box key={option.id}>
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
                            {option.url === "" ? (
                              <label
                                htmlFor={"spec2option-button-file-" + option.id}
                              >
                                <Input
                                  accept="image/*"
                                  id={"spec2option-button-file-" + option.id}
                                  type="file"
                                  multiple
                                  onChange={(e) =>
                                    selectSpec2OptionImageFileChange(e)
                                  }
                                />
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: "100%",

                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <AddCircleOutlineIcon />
                                </Box>
                              </label>
                            ) : (
                              <>
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
                                    src={option.url}
                                    alt=""
                                    width={"80%"}
                                    height={"80%"}
                                  />
                                </Box>
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "-15px",
                                    right: "-15px",
                                  }}
                                >
                                  <IconButton
                                    aria-label="clear"
                                    size="small"
                                    sx={{
                                      backgroundColor: "black",
                                      color: "white",
                                      "&:hover, &.Mui-focusVisible": {
                                        backgroundColor: "gray",
                                      },
                                    }}
                                    onClick={() =>
                                      removeSpec2OptionImageFile(option.id)
                                    }
                                  >
                                    <ClearIcon fontSize="inherit" />
                                  </IconButton>
                                </Box>
                              </>
                            )}
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
              ) : null}
            </Box>
          </Paper>

          <Box>
            <LoadingButton
              variant="contained"
              loading={createLoading}
              onClick={() => handleSave()}
            >
              儲存並上架
            </LoadingButton>
          </Box>
        </Stack>
      </Box>

      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={openCreateHintDialog}
      >
        <DialogTitle>提示</DialogTitle>
        <DialogContent dividers>
          <Typography variant="p">{createHintMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateHint}>確認</Button>
        </DialogActions>
      </Dialog>

      {/* <Box>
        <label htmlFor="contained-button-file">
          <Input
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => handleUploadClick(e)}
          />
          <Button variant="contained" component="span">
            上傳產品照片
          </Button>
        </label>
      </Box> */}

      {/* <Box>
        <ImageList
          sx={{
            width: "100%",
            height: 300,
            transform: "translateZ(0)",
            backgroundColor: "white",
            overflow: "auto",
          }}
          cols={4}
          rowHeight={200}
          gap={8}
        >
          {pictures.map((pic, index) => (
            <ImageListItem key={index} loading="lazy">
              <img src={pic} alt="" />
              <ImageListItemBar
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0)",
                }}
                position="top"
                actionIcon={
                  <IconButton
                    sx={{ backgroundColor: "black", color: "white" }}
                    onClick={() => removePicture(index)}
                  >
                    <ClearIcon />
                  </IconButton>
                }
                actionPosition="right"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box> */}
    </Box>
  );
};

export default ProductCreate;
