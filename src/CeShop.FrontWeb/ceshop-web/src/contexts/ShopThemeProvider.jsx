import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme();

const ShopThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ShopThemeProvider;
