import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Icon,
  Collapse,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Description,
  Vaccines,
  CalendarMonth,
  LocalHospital,
  Info,
  ReportProblem,
  WarningAmber,
  CheckCircle,
  SignalCellularAlt,
} from "@mui/icons-material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import diseasesData from "./data/diseasesData";

// Fonction pour rendre les badges et icônes en fonction de la gravité
const renderSeverityBadge = (severity) => {
  switch (severity) {
    case "Mild":
      return (
        <SoftBadge
          color="success"
          size="sm"
          icon={<CheckCircle sx={{ fontSize: 16, mr: 0.5 }} />}
          badgeContent="Mild"
        />
      );
    case "Moderate":
      return (
        <SoftBadge
          color="warning"
          size="sm"
          icon={<WarningAmber sx={{ fontSize: 16, mr: 0.5 }} />}
          badgeContent="Moderate"
        />
      );
    case "Severe":
      return (
        <SoftBadge
          color="error"
          size="sm"
          icon={<ReportProblem sx={{ fontSize: 16, mr: 0.5 }} />}
          badgeContent="Severe"
        />
      );
    case "Controlled":
      return (
        <SoftBadge
          color="info"
          size="sm"
          icon={<Info sx={{ fontSize: 16, mr: 0.5 }} />}
          badgeContent="Controlled"
        />
      );
    case "Stage 1":
      return (
        <SoftBadge
          color="primary"
          size="sm"
          icon={<SignalCellularAlt sx={{ fontSize: 16, mr: 0.5 }} />}
          badgeContent="Stage 1"
        />
      );
    default:
      return null;
  }
};

const DiseaseItem = ({ disease, darkMode }) => (
  <Card
    sx={{
      mb: 3,
      p: 3,
      borderRadius: 3,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      background: darkMode ? "#2c3e50" : "#fff",
      transition: "all 0.3s ease",
    }}
  >
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <SoftTypography variant="h6" fontWeight="bold" color={darkMode ? "white" : "dark"}>
          {disease.name}
        </SoftTypography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CalendarMonth sx={{ fontSize: 18, color: darkMode ? "#ccc" : "text.secondary" }} />
          <SoftTypography variant="caption" color={darkMode ? "gray" : "text.secondary"}>
            {disease.diagnosisDate}
          </SoftTypography>
        </Stack>
      </Stack>

      {renderSeverityBadge(disease.severity)}

      <Stack direction="row" spacing={1} alignItems="center">
        <Description sx={{ fontSize: 20, color: darkMode ? "#ccc" : "#0077b6" }} />
        <SoftTypography variant="button" fontWeight="bold" color={darkMode ? "white" : "dark"}>
          Description:
        </SoftTypography>
      </Stack>
      <SoftTypography variant="body2" color={darkMode ? "gray" : "text"}>
        {disease.description}
      </SoftTypography>

      <Stack direction="row" spacing={1} alignItems="center" mt={1}>
        <Vaccines sx={{ fontSize: 20, color: darkMode ? "#ccc" : "#388e3c" }} />
        <SoftTypography variant="button" fontWeight="bold" color={darkMode ? "white" : "dark"}>
          Treatment:
        </SoftTypography>
      </Stack>
      <SoftTypography variant="body2" color={darkMode ? "gray" : "text"}>
        {disease.treatment}
      </SoftTypography>
    </Stack>
  </Card>
);

DiseaseItem.propTypes = {
  disease: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

const DiseaseCategory = ({ category, darkMode }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: darkMode ? "#2c3e50" : "#fff",
      }}
    >
      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        onClick={() => setExpanded(!expanded)}
        sx={{
          cursor: "pointer",
          "&:hover": {
            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 119, 182, 0.1)",
          },
        }}
      >
        <SoftBox display="flex" alignItems="center" gap={1}>
          <LocalHospital sx={{ fontSize: 24, color: darkMode ? "#e0e0e0" : "#0077b6" }} />
          <SoftTypography variant="h5" fontWeight="medium" color={darkMode ? "white" : "dark"}>
            {category.name} ({category.items.length})
          </SoftTypography>
        </SoftBox>
        <Icon color={darkMode ? "inherit" : "action"}>
          {expanded ? "expand_less" : "expand_more"}
        </Icon>
      </SoftBox>

      <Collapse in={expanded}>
        <SoftBox p={2}>
          {category.items.map((disease, index) => (
            <DiseaseItem key={index} disease={disease} darkMode={darkMode} />
          ))}
        </SoftBox>
      </Collapse>
    </Card>
  );
};

DiseaseCategory.propTypes = {
  category: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

const PatientDiseases = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox
        py={3}
        px={2}
        sx={{
          background: darkMode
            ? "linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%)"
            : "linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
          minHeight: "100vh",
        }}
      >
        <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          p={3}
          sx={{
            background: darkMode ? "rgba(255, 255, 255, 0.08)" : "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SoftTypography variant="h3" fontWeight="bold" color={darkMode ? "white" : "dark"}>
            Medical Conditions
          </SoftTypography>

          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="info"
                sx={{
                  "& .MuiSwitch-thumb": {
                    backgroundColor: darkMode ? "#e0e0e0" : "#0077b6",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: darkMode ? "#34495e" : "#b0bec5",
                  },
                }}
              />
            }
            label={
              <SoftBox display="flex" alignItems="center" gap={1}>
                {darkMode ? (
                  <DarkMode sx={{ color: "#e0e0e0" }} />
                ) : (
                  <LightMode sx={{ color: "#f9a825" }} />
                )}
                <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
                  Theme
                </SoftTypography>
              </SoftBox>
            }
            labelPlacement="start"
            sx={{ margin: 0 }}
          />
        </SoftBox>

        <SoftBox>
          {diseasesData.categories.map((category, index) => (
            <DiseaseCategory key={index} category={category} darkMode={darkMode} />
          ))}
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default PatientDiseases;
