import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PatientDashboardCard from "./components/PatientDashboardCard";

function Dashboard() {
  const patientData = {
    diseases: 3,
    consultations: 5,
    laboratory: 8,
    imaging: 4
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <SoftTypography variant="h3" fontWeight="bold" gutterBottom>
            My Electronic Health Record
          </SoftTypography>
          <SoftTypography variant="body1" color="text" mb={3}>
            Access your complete medical information in one secure location.
          </SoftTypography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <PatientDashboardCard
                title="Diseases"
                count={patientData.diseases}
                icon="coronavirus"
                color="error"
                path="/patient/diseases"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
            <PatientDashboardCard
  title="Consultations"
  count={patientData.consultations}
  icon="calendar_today"
  color="info"
  path="/patient/consultations" // Doit correspondre à la route
/>
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <PatientDashboardCard
                title="Laboratory"
                count={patientData.laboratory}
                icon="biotech"
                color="success"
                path="/patient/laboratory"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <PatientDashboardCard
                title="Medical Imaging"
                count={patientData.imaging}
                icon="radiology"
                color="warning"
                path="/patient/imaging"
              />
            </Grid>
          </Grid>
        </SoftBox>

        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
              Recent Activity
            </SoftTypography>
            <SoftBox>
              <SoftTypography variant="body2" color="text">
                - Last appointment: Dr. Smith, 06/15/2023
              </SoftTypography>
              <SoftTypography variant="body2" color="text">
                - New test result: Blood panel, 06/10/2023
              </SoftTypography>
              <SoftTypography variant="body2" color="text">
                - Chest CT scan added, 06/05/2023
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </Card>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;