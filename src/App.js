import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { createTheme } from "@mui/material/styles";
import { Icon } from "@mui/material";

// Polices
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Composants personnalisés
import SoftBox from "components/SoftBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Thèmes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import { medicalTheme } from "layouts/authentication/sign-in/medicalTheme";

// Routes
import routes from "routes";

// Context
import { useSoftUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Image de la marque
import brand from "assets/images/logo3.png";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Gestion du cache RTL
  useEffect(() => {
    if (direction === "rtl") {
      const cacheRtl = createCache({
        key: "rtl",
        stylisPlugins: [rtlPlugin],
      });
      setRtlCache(cacheRtl);
    }
  }, [direction]);

  // Routes sans sidebar
  const noSidebarRoutes = useMemo(
    () => ["/authentication/sign-in", "/authentication/sign-up"],
    []
  );

  const showSidebar = useMemo(
    () => !noSidebarRoutes.includes(pathname),
    [pathname, noSidebarRoutes]
  );

  // Fusion du thème principal avec le thème médical
  const mergedTheme = useMemo(() => {
    const baseTheme = direction === "rtl" ? themeRTL : theme;
    return createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        ...medicalTheme.palette,
      },
      typography: {
        ...baseTheme.typography,
        ...medicalTheme.typography,
      },
      components: {
        ...baseTheme.components,
        ...medicalTheme.components,
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              fontSize: "1.5rem",
              display: "inline-flex",
              verticalAlign: "middle",
              color: "inherit",
            },
          },
        },
        MuiInputAdornment: {
          styleOverrides: {
            root: {
              "& .MuiSvgIcon-root": {
                color: medicalTheme.palette.primary.main,
              },
            },
          },
        },
      },
    });
  }, [direction]);

  // Gestion des événements de la sidebar
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Changement de direction RTL/LTR
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Scroll en haut à chaque changement de route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Génération dynamique des routes
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }
      return null;
    });

  // Bouton de configuration
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);

  const configsButton = (
    <SoftBox
      //display="flex"
     // justifyContent="center"
      alignItems="center"
      //width="3.5rem"
      //height="3.5rem"
     // bgColor="white"
      //shadow="sm"
      //borderRadius="50%"
      //position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      
    </SoftBox>
  );

  // Contenu principal
  const appContent = (
    <>
      {showSidebar && (
        <Sidenav
          color={sidenavColor}
          brand={brand}
          brandName="Electronic Medical Record"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      )}
      {layout === "dashboard" && <>{configsButton}<Configurator /></>}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={mergedTheme}>
        <CssBaseline />
        {direction === "rtl" && rtlCache ? (
          <CacheProvider value={rtlCache}>{appContent}</CacheProvider>
        ) : (
          appContent
        )}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
