/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState, useEffect, useContext } from "react";

// react-router components
import { useLocation, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import Breadcrumbs from "examples/Breadcrumbs";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Soft UI Dashboard React context
import {
  useSoftUIController,
  setTransparentNavbar,
  setMiniSidenav,
} from "context";

// Import LanguageIcon, Visibility, Edit, ArrowBack, and ZoomIn from MUI
import { Language as LanguageIcon, Visibility, Edit, ArrowBack, ZoomIn } from "@mui/icons-material";

// Import logout service
import { logout } from "services/authService";

// Create a Language Context
const LanguageContext = React.createContext();

export const LanguageProvider = ({ children }) => {
  // Charger la langue depuis localStorage, ou utiliser "en" par défaut
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  const translations = {
    en: {
      profile: "Profile",
      viewProfile: "See Profile",
      editProfile: "Modify Profile",
      logout: "Log Out",
      changeLanguage: "Change Language",
      openMenu: "Open Menu",
      closeMenu: "Close Menu",
      goBack: "Go Back",
      zoomLevel: "Zoom Level",
      selectZoom: "Select Zoom Level",
    },
    fr: {
      profile: "Profil",
      viewProfile: "Voir Profil",
      editProfile: "Modifier Profil",
      logout: "Déconnexion",
      changeLanguage: "Changer de Langue",
      openMenu: "Ouvrir le Menu",
      closeMenu: "Fermer le Menu",
      goBack: "Retour",
      zoomLevel: "Niveau de Zoom",
      selectZoom: "Sélectionner le Niveau de Zoom",
    },
  };

  // Persister la langue dans localStorage lorsque l'état change
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom styles for better ergonomics and styling
const enhancedNavbarStyles = {
  navbar: (theme, { transparentNavbar, absolute, light }) => ({
    ...navbar(theme, { transparentNavbar, absolute, light }),
    background: transparentNavbar
      ? "rgba(255, 255, 255, 0.2)"
      : "linear-gradient(90deg, rgba(230, 240, 250, 0.9), rgba(179, 205, 224, 0.9))",
    backdropFilter: "blur(8px)",
    boxShadow: transparentNavbar
      ? "0 4px 12px rgba(0, 0, 0, 0.05)"
      : "0 4px 12px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 0.8s ease-in-out",
  }),
  navbarContainer: (theme) => ({
    ...navbarContainer(theme),
  }),
  navbarRow: (theme, { isMini }) => ({
    ...navbarRow(theme, { isMini }),
  }),
  navbarIconButton: {
    ...navbarIconButton,
    "& .MuiIcon-root": {
      fontSize: "1.5rem !important",
    },
    "& .MuiTypography-root": {
      fontSize: "1rem !important",
    },
    "&:hover": {
      transform: "scale(1.1)",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    "&:focus": {
      outline: "2px solid #000",
      outlineOffset: "2px",
    },
    transition: "all 0.3s ease",
  },
  navbarMobileMenu: {
    ...navbarMobileMenu,
    "& .MuiIcon-root": {
      fontSize: "1.5rem !important",
    },
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    color: "#333",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      color: "#000",
      "& .MuiSvgIcon-root": {
        color: "#000",
      },
    },
    transition: "all 0.3s ease",
  },
  menuIcon: {
    fontSize: "1.2rem !important",
    color: "#666",
  },
  flag: {
    fontSize: "1.2rem",
    mr: 1,
  },
};

// Define keyframes for animations
const keyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject keyframes into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar } = controller;
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [zoomMenuAnchor, setZoomMenuAnchor] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level (100%)
  const zoomOptions = [0.5, 0.75, 1, 1.25, 1.5]; // Zoom levels: 50%, 75%, 100%, 125%, 150%
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();

  // Use LanguageContext with a fallback
  const context = useContext(LanguageContext);
  const { language, setLanguage, t } = context || {
    language: "en",
    setLanguage: () => {},
    t: (key) => key,
  };

  const connectedUser = JSON.parse(localStorage.getItem("connectedUser"));

  // Apply zoom level to the document body
  useEffect(() => {
    document.body.style.zoom = zoomLevel;
    return () => {
      // Reset zoom when component unmounts
      document.body.style.zoom = 1;
    };
  }, [zoomLevel]);

  useEffect(() => {
    // Set navbar type based on fixedNavbar prop
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // Handle transparent navbar on scroll
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleLogout = () => {
    logout(navigate);
  };

  // Navigate to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfileAction = (action) => {
    if (action === "view") {
      navigate("/profile");
    } else if (action === "edit") {
      navigate("/profile/edit");
    }
    handleProfileMenuClose();
  };

  // Language menu handlers
  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    handleLanguageMenuClose();
  };

  // Zoom menu handlers
  const handleZoomMenuOpen = (event) => {
    setZoomMenuAnchor(event.currentTarget);
  };

  const handleZoomMenuClose = () => {
    setZoomMenuAnchor(null);
  };

  const handleZoomLevelChange = (level) => {
    setZoomLevel(level);
    handleZoomMenuClose();
  };

  return (
    <ErrorBoundary>
      <AppBar
        position={absolute ? "absolute" : navbarType}
        color="inherit"
        sx={(theme) => enhancedNavbarStyles.navbar(theme, { transparentNavbar, absolute, light })}
      >
        <Toolbar sx={(theme) => enhancedNavbarStyles.navbarContainer(theme)}>
          {/* Left Side: Back Arrow, Mini Sidenav Toggle, and Breadcrumbs */}
          <SoftBox
            color="inherit"
            mb={{ xs: 1, md: 0 }}
            sx={(theme) => enhancedNavbarStyles.navbarRow(theme, { isMini })}
            display="flex"
            alignItems="center"
            gap={2}
          >
            {/* Back Arrow */}
            <Tooltip title={t("goBack")} placement="bottom">
              <IconButton
                size="small"
                color="inherit"
                sx={enhancedNavbarStyles.navbarIconButton}
                onClick={handleGoBack}
                aria-label={t("goBack")}
              >
                <ArrowBack
                  sx={({ palette: { dark, white } }) => ({
                    color: light ? white.main : dark.main,
                  })}
                />
              </IconButton>
            </Tooltip>

            {/* Mini Sidenav Toggle */}
            <Tooltip title={miniSidenav ? t("openMenu") : t("closeMenu")} placement="bottom">
              <IconButton
                size="small"
                color="inherit"
                sx={enhancedNavbarStyles.navbarMobileMenu}
                onClick={handleMiniSidenav}
                aria-label={miniSidenav ? t("openMenu") : t("closeMenu")}
              >
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </Tooltip>

            <Breadcrumbs
              icon="home"
              title={route[route.length - 1]}
              route={route}
              light={light}
            />
          </SoftBox>

          {/* Right Side: Profile, Language Switcher, Zoom Control, Logout */}
          <SoftBox sx={(theme) => enhancedNavbarStyles.navbarRow(theme, { isMini })}>
            <SoftBox color={light ? "white" : "inherit"} display="flex" alignItems="center" gap={2}>
              {/* Profile Link (for patients) with Dropdown */}
              {connectedUser?.role === "patient" && (
                <>
                  <Tooltip title={t("profile")} placement="bottom">
                    <IconButton
                      sx={enhancedNavbarStyles.navbarIconButton}
                      size="small"
                      onClick={handleProfileMenuOpen}
                      aria-label={t("profile")}
                    >
                      <Icon
                        sx={({ palette: { dark, white } }) => ({
                          color: light ? white.main : dark.main,
                        })}
                      >
                        account_circle
                      </Icon>
                      <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        color={light ? "white" : "dark"}
                      >
                        {t("profile")}
                      </SoftTypography>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={profileMenuAnchor}
                    open={Boolean(profileMenuAnchor)}
                    onClose={handleProfileMenuClose}
                  >
                    <MenuItem
                      onClick={() => handleProfileAction("view")}
                      sx={enhancedNavbarStyles.menuItem}
                    >
                      <Visibility sx={enhancedNavbarStyles.menuIcon} />
                      {t("viewProfile")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleProfileAction("edit")}
                      sx={enhancedNavbarStyles.menuItem}
                    >
                      <Edit sx={enhancedNavbarStyles.menuIcon} />
                      {t("editProfile")}
                    </MenuItem>
                  </Menu>
                </>
              )}

              {/* Language Switcher */}
              <Tooltip title={t("changeLanguage")} placement="bottom">
                <IconButton
                  size="small"
                  color="inherit"
                  sx={enhancedNavbarStyles.navbarIconButton}
                  onClick={handleLanguageMenuOpen}
                  aria-label={t("changeLanguage")}
                >
                  <LanguageIcon
                    sx={({ palette: { dark, white } }) => ({
                      color: light ? white.main : dark.main,
                    })}
                  />
                  <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color={light ? "white" : "dark"}
                  >
                    {language === "en" ? "EN" : "FR"}
                  </SoftTypography>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={languageMenuAnchor}
                open={Boolean(languageMenuAnchor)}
                onClose={handleLanguageMenuClose}
              >
                <MenuItem onClick={() => handleLanguageChange("en")} sx={enhancedNavbarStyles.menuItem}>
                  <SoftTypography sx={enhancedNavbarStyles.flag}>🇬🇧</SoftTypography>
                  English
                </MenuItem>
                <MenuItem onClick={() => handleLanguageChange("fr")} sx={enhancedNavbarStyles.menuItem}>
                  <SoftTypography sx={enhancedNavbarStyles.flag}>🇫🇷</SoftTypography>
                  Français
                </MenuItem>
              </Menu>

              {/* Zoom Control (Single Icon with Dropdown) - MOVED UP */}
              <Tooltip title={t("selectZoom")} placement="bottom">
                <IconButton
                  size="small"
                  color="inherit"
                  sx={enhancedNavbarStyles.navbarIconButton}
                  onClick={handleZoomMenuOpen}
                  aria-label={t("selectZoom")}
                >
                  <ZoomIn
                    sx={({ palette: { dark, white } }) => ({
                      color: light ? white.main : dark.main,
                    })}
                  />
                  <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color={light ? "white" : "dark"}
                  >
                    {Math.round(zoomLevel * 100)}%
                  </SoftTypography>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={zoomMenuAnchor}
                open={Boolean(zoomMenuAnchor)}
                onClose={handleZoomMenuClose}
              >
                {zoomOptions.map((level) => (
                  <MenuItem
                    key={level}
                    onClick={() => handleZoomLevelChange(level)}
                    sx={enhancedNavbarStyles.menuItem}
                  >
                    {Math.round(level * 100)}%
                  </MenuItem>
                ))}
              </Menu>

              {/* Log Out - MOVED DOWN */}
              <Tooltip title={t("logout")} placement="bottom">
                <IconButton
                  size="small"
                  color="inherit"
                  sx={enhancedNavbarStyles.navbarIconButton}
                  onClick={handleLogout}
                  aria-label={t("logout")}
                >
                  <Icon
                    sx={({ palette: { dark, white } }) => ({
                      color: light ? white.main : dark.main,
                    })}
                  >
                    logout
                  </Icon>
                  <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color={light ? "white" : "dark"}
                  >
                    {t("logout")}
                  </SoftTypography>
                </IconButton>
              </Tooltip>
            </SoftBox>
          </SoftBox>
        </Toolbar>
      </AppBar>
    </ErrorBoundary>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;