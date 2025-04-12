import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Collapse from "@mui/material/Collapse";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import diseasesData from "./data/diseasesData";

const DiseaseItem = ({ disease }) => {
  return (
    <Card sx={{ mb: 2, p: 3 }}>
      <SoftBox display="flex" justifyContent="space-between">
        <SoftTypography variant="h6" fontWeight="bold">
          {disease.name}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          Diagnosed: {disease.diagnosisDate}
        </SoftTypography>
      </SoftBox>

      <SoftBox mt={1} mb={2}>
        <SoftBadge
          color={
            disease.severity === "Severe" ? "error" :
            disease.severity === "Moderate" ? "warning" : "success"
          }
          badgeContent={disease.severity}
          size="xs"
        />
      </SoftBox>

      <SoftBox mb={2}>
        <SoftTypography variant="button" fontWeight="bold">
          Description:
        </SoftTypography>
        <SoftTypography variant="body2">
          {disease.description}
        </SoftTypography>
      </SoftBox>

      <SoftBox>
        <SoftTypography variant="button" fontWeight="bold">
          Treatment:
        </SoftTypography>
        <SoftTypography variant="body2">
          {disease.treatment}
        </SoftTypography>
      </SoftBox>
    </Card>
  );
};

DiseaseItem.propTypes = {
  disease: PropTypes.shape({
    name: PropTypes.string.isRequired,
    diagnosisDate: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(["Mild", "Moderate", "Severe"]).isRequired,
    description: PropTypes.string.isRequired,
    treatment: PropTypes.string.isRequired
  }).isRequired
};

const DiseaseCategory = ({ category }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card sx={{ mb: 3 }}>
      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: "pointer" }}
      >
        <SoftBox display="flex" alignItems="center">
          <Icon sx={{ mr: 1, color: "info.main" }}>{category.icon}</Icon>
          <SoftTypography variant="h5" fontWeight="medium">
            {category.name} ({category.items.length})
          </SoftTypography>
        </SoftBox>
        <Icon>{expanded ? "expand_less" : "expand_more"}</Icon>
      </SoftBox>

      <Collapse in={expanded}>
        <SoftBox p={2}>
          {category.items.map((disease, index) => (
            <DiseaseItem key={index} disease={disease} />
          ))}
        </SoftBox>
      </Collapse>
    </Card>
  );
};

DiseaseCategory.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        diagnosisDate: PropTypes.string.isRequired,
        severity: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        treatment: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

const PatientDiseases = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <SoftTypography variant="h2" fontWeight="bold" gutterBottom>
            Medical Conditions
          </SoftTypography>
          
          {diseasesData.categories.map((category, index) => (
            <DiseaseCategory key={index} category={category} />
          ))}
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default PatientDiseases;