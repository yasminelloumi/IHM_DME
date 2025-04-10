import PropTypes from 'prop-types';
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { Link } from "react-router-dom";

function PatientDashboardCard({ title, count, icon, color, path }) {
  return (
    <Card sx={{ height: "100%", cursor: "pointer" }} component={Link} to={path}>
      <SoftBox p={3} display="flex" flexDirection="column" height="100%">
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <SoftBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgColor={color}
            color="white"
            width="4rem"
            height="4rem"
            borderRadius="md"
            shadow="md"
          >
            <Icon fontSize="large">{icon}</Icon>
          </SoftBox>
          <SoftTypography variant="h2" fontWeight="bold" color={color}>
            {count}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2}>
          <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
            {title}
          </SoftTypography>
          <SoftTypography variant="body2" color="text">
            {title === "Diseases" && "View your medical conditions and diagnoses"}
            {title === "Appointments" && "Your scheduled and past medical visits"} 
            {title === "Laboratory" && "Your lab test results and analysis reports"}
            {title === "medical imaging center results" && "Your radiology scans and medical imaging"}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt="auto" pt={2}>
          <SoftTypography 
            variant="button" 
            color={color} 
            fontWeight="medium"
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": { textDecoration: "underline" }
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
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired
};

export default PatientDashboardCard;