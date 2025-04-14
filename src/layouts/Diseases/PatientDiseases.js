// PatientDiseases.js
import React, { useState, useEffect } from "react";
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
import { getConditionsByPatientId } from "services/conditionService";

// Badge rendering by severity level
const renderSeverityBadge = (severity) => {
  const badgeProps = {
    Mild: { color: "success", icon: <CheckCircle sx={{ fontSize: 16, mr: 0.5 }} /> },
    Moderate: { color: "warning", icon: <WarningAmber sx={{ fontSize: 16, mr: 0.5 }} /> },
    Severe: { color: "error", icon: <ReportProblem sx={{ fontSize: 16, mr: 0.5 }} /> },
    Controlled: { color: "info", icon: <Info sx={{ fontSize: 16, mr: 0.5 }} /> },
    "Stage 1": { color: "primary", icon: <SignalCellularAlt sx={{ fontSize: 16, mr: 0.5 }} /> },
  };

  const badge = badgeProps[severity];
  return (
    badge && (
      <SoftBadge
        color={badge.color}
        size="sm"
        icon={badge.icon}
        badgeContent={severity}
      />
    )
  );
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
            {disease.diagnosisDate || "Unknown date"}
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
        {disease.description || "No description available."}
      </SoftTypography>

      <Stack direction="row" spacing={1} alignItems="center" mt={1}>
        <Vaccines sx={{ fontSize: 20, color: darkMode ? "#ccc" : "#388e3c" }} />
        <SoftTypography variant="button" fontWeight="bold" color={darkMode ? "white" : "dark"}>
          Treatment:
        </SoftTypography>
      </Stack>
      <SoftTypography variant="body2" color={darkMode ? "gray" : "text"}>
        {disease.treatment || "No treatment specified."}
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

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <SoftBox p={2}>
          <Stack spacing={3}>
            {category.items.map((disease, index) => (
              <DiseaseItem key={index} disease={disease} darkMode={darkMode} />
            ))}
          </Stack>
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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("connectedUser"));
        const patientId = user?.id;

        if (!patientId) {
          console.error("No patient ID found in localStorage.");
          return;
        }

        const conditions = await getConditionsByPatientId(patientId);

        const grouped = {
          Allergy: [],
          Chronic: [],
          Infectious: [],
        };

        conditions.forEach((condition) => {
          const type = condition.type?.toLowerCase();
          if (type === "allergy") grouped.Allergy.push(condition);
          else if (type === "chronic") grouped.Chronic.push(condition);
          else if (type === "infectious") grouped.Infectious.push(condition);
        });

        const categorized = Object.keys(grouped).map((key) => ({
          name: key,
          items: grouped[key],
        }));

        setCategories(categorized);
      } catch (error) {
        console.error("Error loading conditions:", error);
      }
    };

    fetchConditions();
  }, []);

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
          {categories.every((cat) => cat.items.length === 0) ? (
            <SoftTypography
              variant="h6"
              color={darkMode ? "gray" : "text"}
              textAlign="center"
              mt={5}
            >
              You have no recorded medical conditions at the moment.
            </SoftTypography>
          ) : (
            categories.map((category, index) => (
              category.items.length > 0 && (
                <DiseaseCategory key={index} category={category} darkMode={darkMode} />
              )
            ))
          )}
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default PatientDiseases;
