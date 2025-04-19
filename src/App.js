import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

// Polices
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Components
import SoftBox from "components/SoftBox";
import Sidenav from "examples/Sidenav";

// Context
import { useSoftUIController, setMiniSidenav } from "context";

// Assets
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import routes from "routes";

// Soft UI Dashboard React contexts
import { useSoftUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brand from "assets/images/EMRlogo.jpg";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache RTL
  useEffect(() => {
    if (direction === "rtl") {
      const cacheRtl = createCache({
        key: "rtl",
        stylisPlugins: [rtlPlugin],
      });
      setRtlCache(cacheRtl);
    }
  }, [direction]);

  // Liste des routes sans sidebar
  const noSidebarRoutes = useMemo(
    () => ["/authentication/sign-in", "/authentication/sign-up"],
    []
  );

  const showSidebar = useMemo(
    () => !noSidebarRoutes.includes(pathname),
    [pathname, noSidebarRoutes]
  );

  // Fusion des thèmes avec configuration spécifique pour les icônes
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
              fontSize: '1.5rem',
              // Ajoutez ces propriétés pour garantir l'affichage des icônes
              display: 'inline-flex',
              verticalAlign: 'middle',
              color: 'inherit',
            },
          },
        },
        MuiInputAdornment: {
          styleOverrides: {
            root: {
              // Style pour les icônes dans les InputAdornment
              '& .MuiSvgIcon-root': {
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

  // Effets
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Configuration des routes
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={brand}
              brandName="Electronic Medical Record"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showSidebar && (
        <Sidenav
          color={sidenavColor}
          brand={brand}
          brandName="Dossier Médical Électronique"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      )}
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={mergedTheme}>
        {direction === "rtl" ? (
          <CacheProvider value={rtlCache}>{appContent}</CacheProvider>
        ) : (
          appContent
        )}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}