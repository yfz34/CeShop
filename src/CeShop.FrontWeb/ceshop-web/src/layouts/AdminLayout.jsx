import { useState } from "react";
import { Outlet } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, createTheme, styled, ThemeProvider } from "@mui/material";
import Navbar from "../components/admin/Navbar";
import Header from "../components/admin/Header";
import { useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

let theme = createTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#081627",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up("md")]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255,255,255,0.15)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#4fc3f7",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
          "& svg": {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const drawerWidth = 256;

const LayoutContainer = styled(Box)(() => ({
  display: "flex",
  minHeight: "100vh",
}));

const NavBox = styled(Box)(() => ({
  width: { sm: drawerWidth },
  flexShrink: { sm: 0 },
}));

const HeaderBox = styled(Box)(() => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

const ContentBox = styled(Box)(() => ({
  flex: 1,
  py: 6,
  px: 4,
  bgcolor: "#eaeff1",
  // maxWidth: "936px",
  // margin: "auto",
}));

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    // <ThemeProvider theme={theme}>
    //   <LayoutContainer>
    //     <CssBaseline />
    //     <NavBox component="nav">
    //       {/* mobile */}
    //       {isSmUp ? null : (
    //         <Navbar
    //           PaperProps={{ style: { width: drawerWidth } }}
    //           variant="temporary"
    //           open={mobileOpen}
    //           onClose={handleDrawerToggle}
    //         />
    //       )}

    //       {/* desktop */}
    //       <Navbar
    //         PaperProps={{ style: { width: drawerWidth } }}
    //         sx={{ display: { sm: "block", xs: "none" } }}
    //       />
    //     </NavBox>
    //     <HeaderBox>
    //       <Header onDrawerToggle={handleDrawerToggle} />
    //       <ContentBox component="main">
    //         <Outlet />
    //       </ContentBox>
    //     </HeaderBox>
    //   </LayoutContainer>
    // </ThemeProvider>

    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navbar
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}

          <Navbar
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: "block", xs: "none" } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header
            drawerWidth={drawerWidth}
            onDrawerToggle={handleDrawerToggle}
          />
          <Box
            component="main"
            sx={{
              flex: 1,
              py: 6,
              px: 4,
              bgcolor: "#eaeff1",
              marginTop: "48px",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
