import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PatientDashboardCard from "./components/PatientDashboardCard";

function Dashboard() {
  const connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  const role = connectedUser?.role;

  const patientData = {
    diseases: 3,
    consultations: 5,
    laboratory: 8,
    imaging: 4
  };

  const allCards = [
    {
      title: "Diseases",
      count: patientData.diseases,
      icon: "coronavirus",
      color: "error",
      path: "/patient/diseases"
    },
    {
      title: "Consultations",
      count: patientData.consultations,
      icon: "calendar_today",
      color: "info",
      path: "/patient/consultations"
    },
    {
      title: "Laboratory",
      count: patientData.laboratory,
      icon: "biotech",
      color: "success",
      path: "/patient/laboratory"
    },
    {
      title: "Medical Imaging",
      count: patientData.imaging,
      icon: "radiology",
      color: "warning",
      path: "/patient/imaging"
    }
  ];

  // Filter cards based on role
  let allowedCards = allCards;

  if (role === "patient") {
    allowedCards = allCards.filter(card => ["Diseases", "Consultations"].includes(card.title));
  } else if (role === "laboratoire") {
    allowedCards = allCards.filter(card => card.title !== "Medical Imaging");
  } else if (role === "centreImagerie") {
    allowedCards = allCards.filter(card => card.title !== "Laboratory");
  } else if (role === "medecins") {
    allowedCards = allCards.filter(card => card.title !== "Laboratory" && card.title !== "Medical Imaging");
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <SoftTypography variant="h3" fontWeight="bold" gutterBottom>
            {role === "patient"
              ? "My Electronic Health Record"
              : "Electronic Health Record"}
          </SoftTypography>
          <SoftTypography variant="body1" color="text" mb={3}>
            {role === "patient"
              ? "Access your complete medical information in one secure location."
              : "Access the complete medical information in one secure location."}
          </SoftTypography>

          {/* Centered visible cards */}
          <Grid container spacing={3} justifyContent="center">
            {allowedCards.map(card => (
              <Grid key={card.title} item xs={12} sm={6} md={4} lg={3}>
                <PatientDashboardCard
                  title={card.title}
                  count={card.count}
                  icon={card.icon}
                  color={card.color}
                  path={card.path}
                />
              </Grid>
            ))}
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
