import PropTypes from 'prop-types';
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { Link } from "react-router-dom";

function PatientDashboardCard({ title, count, icon, color, path }) {
  const cardConfig = {
    "Diseases": {
      color: "#1976d2",
      icon: "healing",
      path: "/diseases"  // Retirer '/patient/'
    },
    "Consultations": {
      color: "#64b5f6",
      icon: "calendar_today",
      path: "/consultations"
    },
    "Laboratory": {
      color: "#0288d1",
      icon: "science",
      path: "/laboratory"
    },
    "Medical Imaging": {
      color: "#01579b",
      icon: "collections",
      path: "/imaging"
    }
  };

  const config = cardConfig[title] || { color, icon, path };

  return (
    <Card sx={{ height: "100%", cursor: "pointer" }}>
      <SoftBox p={3} display="flex" flexDirection="column" height="100%">
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <SoftBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgColor={config.color}
            color="white"
            width="4rem"
            height="4rem"
            borderRadius="md"
            shadow="md"
          >
            <Icon fontSize="large">{config.icon}</Icon>
          </SoftBox>
          <SoftTypography variant="h2" fontWeight="bold" color={config.color}>
            {count}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2}>
          <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
            {title}
          </SoftTypography>
          <SoftTypography variant="body2" color="text">
            {title === "Diseases" && "View your medical conditions and diagnoses"}
            {title === "Consultations" && "Your scheduled and past medical visits"} 
            {title === "Laboratory" && "Your lab test results and analysis reports"}
            {title === "Medical Imaging" && "Your radiology scans and medical imaging"}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt="auto" pt={2}>
          <SoftTypography 
            component={Link}
            to={config.path}
            variant="button" 
            color={config.color} 
            fontWeight="medium"
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": { textDecoration: "underline" },
              textDecoration: 'none'
            }}
          >
            View Details
            <Icon sx={{ ml: 0.5 }}>arrow_forward</Icon>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

PatientDashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
  path: PropTypes.string
};

export default PatientDashboardCard;