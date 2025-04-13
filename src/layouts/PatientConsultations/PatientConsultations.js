import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import {
  Event as EventIcon,
  MedicalServices as MedicalServicesIcon,
  LocalHospital as LocalHospitalIcon,
  Science as ScienceIcon,
  InsertPhoto as InsertPhotoIcon,
  Notes as NotesIcon,
  Healing as DiagnosesIcon,
  Description as DescriptionIcon,
  AccessTime as TimeIcon,
  Person as DoctorIcon,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { FormControlLabel, Switch } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Demo data for consultations
const consultationsData = [
  {
    id: 1,
    date: "June 15, 2023",
    time: "10:30 AM",
    doctor: "Dr. Smith",
    specialty: "Cardiologist",
    reason: "Chest pain evaluation",
    diagnosis: "Hypertension (Stage 1)",
    treatments: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
      { name: "Blood pressure monitoring", frequency: "Twice daily" }
    ],
    tests: ["ECG", "Complete blood count", "Cholesterol panel"],
    images: ["Chest X-ray"],
    notes: "Patient advised to reduce sodium intake and exercise regularly."
  },
  {
    id: 2,
    date: "May 10, 2023",
    time: "2:15 PM",
    doctor: "Dr. Johnson",
    specialty: "General Practitioner",
    reason: "Annual physical examination",
    diagnosis: "Normal health status",
    treatments: [],
    tests: ["Complete blood count", "Urinalysis"],
    images: [],
    notes: "All results within normal range. Recommended follow-up in one year."
  }
];

// Data for trends chart
const consultationTrends = [
  { month: "Jan", consultations: 3 },
  { month: "Feb", consultations: 5 },
  { month: "Mar", consultations: 4 },
  { month: "Apr", consultations: 7 },
  { month: "May", consultations: 6 },
  { month: "Jun", consultations: 2 }
];

// Custom styled card component
const StyledCard = ({ children, icon, title, color = "primary", darkMode }) => (
  <Card sx={{
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: 2,
    background: darkMode ? "#2c3e50" : "#fff",
    borderLeft: `4px solid`,
    borderLeftColor: darkMode ? "#0077b6" : `${color}.main`
  }}>
    <SoftBox p={2}>
      <SoftBox display="flex" alignItems="center" mb={2}>
        <Avatar sx={{
          bgcolor: darkMode ? "#34495e" : `${color}.light`,
          color: darkMode ? "#e0e0e0" : `${color}.main`,
          mr: 2,
          width: 40,
          height: 40
        }}>
          {icon}
        </Avatar>
        <SoftTypography variant="h6" fontWeight="bold" color={darkMode ? "white" : "dark"}>
          {title}
        </SoftTypography>
      </SoftBox>
      {children}
    </SoftBox>
  </Card>
);

StyledCard.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  darkMode: PropTypes.bool.isRequired
};

// Treatment item component
const TreatmentItem = ({ treatment, darkMode }) => (
  <SoftBox display="flex" alignItems="center" mb={1} pl={2}>
    <MedicalServicesIcon color={darkMode ? "secondary" : "primary"} fontSize="small" sx={{ mr: 1 }} />
    <SoftTypography variant="button" fontWeight="regular" color={darkMode ? "white" : "dark"}>
      {treatment.name} - {treatment.dosage} ({treatment.frequency})
    </SoftTypography>
  </SoftBox>
);

TreatmentItem.propTypes = {
  treatment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dosage: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired
  }).isRequired,
  darkMode: PropTypes.bool.isRequired
};

// Test item component
const TestItem = ({ test, darkMode }) => (
  <SoftBox display="flex" alignItems="center" mb={1} pl={2}>
    <ScienceIcon color={darkMode ? "secondary" : "secondary"} fontSize="small" sx={{ mr: 1 }} />
    <SoftTypography variant="button" fontWeight="regular" color={darkMode ? "white" : "dark"}>
      {test}
    </SoftTypography>
  </SoftBox>
);

TestItem.propTypes = {
  test: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired
};

// Image item component
const ImageItem = ({ image, darkMode }) => (
  <SoftBox display="flex" alignItems="center" mb={1} pl={2}>
    <InsertPhotoIcon color={darkMode ? "secondary" : "info"} fontSize="small" sx={{ mr: 1 }} />
    <SoftTypography variant="button" fontWeight="regular" color={darkMode ? "white" : "dark"}>
      {image}
    </SoftTypography>
  </SoftBox>
);

ImageItem.propTypes = {
  image: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired
};

// Stats card component
const StatsCard = ({ stats, darkMode }) => (
  <Card sx={{
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    background: darkMode ? "#2c3e50" : "#fff",
    height: "100%"
  }}>
    <CardContent>
      <SoftTypography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "white" : "dark"}>
        Consultation Stats
      </SoftTypography>
      <SoftBox display="flex" flexDirection="column" gap={2}>
        {Object.entries(stats).map(([key, value]) => (
          <SoftBox key={key} display="flex" alignItems="center" gap={1}>
            <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"} textTransform="uppercase">
              {key.replace(/([A-Z])/g, ' $1')}:
            </SoftTypography>
            <SoftTypography variant="body1" fontWeight="medium" color={darkMode ? "white" : "dark"}>
              {value}
            </SoftTypography>
          </SoftBox>
        ))}
      </SoftBox>
    </CardContent>
  </Card>
);

StatsCard.propTypes = {
  stats: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired
};

// Trends card component
const TrendsCard = ({ data, darkMode }) => (
  <Card sx={{
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    background: darkMode ? "#2c3e50" : "#fff",
    height: "100%"
  }}>
    <CardContent>
      <SoftTypography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "white" : "dark"}>
        Monthly Consultations
      </SoftTypography>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#e0e0e0"} />
          <XAxis dataKey="month" stroke={darkMode ? "#e0e0e0" : "#333"} />
          <YAxis stroke={darkMode ? "#e0e0e0" : "#333"} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#34495e" : "#fff",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line 
            type="monotone" 
            dataKey="consultations" 
            stroke="#0077b6" 
            strokeWidth={2} 
            dot={{ fill: darkMode ? "#e0e0e0" : "#0077b6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

TrendsCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      consultations: PropTypes.number.isRequired
    })
  ).isRequired,
  darkMode: PropTypes.bool.isRequired
};

// Consultation card component
const ConsultationCard = ({ consultation, darkMode }) => {
  return (
    <Card sx={{ 
      mb: 4,
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      background: "#ffffff"  // Fond blanc
    }}>
      {/* Header section - Bleu foncé */}
      <SoftBox 
        p={3} 
        bgcolor="#005F73"  // Bleu médical foncé
        color="white"
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        flexWrap="wrap"
      >
        <SoftBox display="flex" alignItems="center">
          <EventIcon sx={{ mr: 1, color: "#ffffff" }} />
          <SoftTypography variant="h6" fontWeight="bold">
            {consultation.date} at {consultation.time}
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex" alignItems="center">
          <DoctorIcon sx={{ mr: 1, color: "#ffffff" }} />
          <SoftTypography variant="h6" fontWeight="medium">
            {consultation.doctor} ({consultation.specialty})
          </SoftTypography>
        </SoftBox>
      </SoftBox>

      <SoftBox p={3}>
        <Grid container spacing={3}>
          {/* Reason and Diagnosis */}
          <Grid item xs={12} md={6}>
            <StyledCard 
              icon={<DescriptionIcon sx={{ color: '#005F73' }} />}  // Icône bleu foncé
              title="Reason for Visit"
              color="info"
              darkMode={darkMode}
              sx={{
                backgroundColor: "#ffffff", // Fond blanc
                border: '2px solid #e0e0e0', // Bordure grise légère
              }}
            >
              <SoftTypography variant="button" fontWeight="regular" color="text.secondary">
                {consultation.reason}
              </SoftTypography>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard 
              icon={<DiagnosesIcon sx={{ color: '#005F73' }} />}  // Icône bleu foncé
              title="Diagnosis"
              color="info"
              darkMode={darkMode}
              sx={{
                backgroundColor: "#ffffff",
                border: '2px solid #e0e0e0',
              }}
            >
              <SoftTypography variant="button" fontWeight="regular" color="text.secondary">
                {consultation.diagnosis}
              </SoftTypography>
            </StyledCard>
          </Grid>

          {/* Treatments */}
          {consultation.treatments.length > 0 && (
            <Grid item xs={12}>
              <StyledCard 
                icon={<MedicalServicesIcon sx={{ color: '#005F73' }} />}  // Icône bleu foncé
                title="Prescribed Treatments"
                color="info"
                darkMode={darkMode}
                sx={{
                  backgroundColor: "#ffffff",
                  border: '2px solid #e0e0e0',
                }}
              >
                {consultation.treatments.map((treatment, index) => (
                  <TreatmentItem key={index} treatment={treatment} darkMode={darkMode} />
                ))}
              </StyledCard>
            </Grid>
          )}

          {/* Tests and Images */}
          {(consultation.tests.length > 0 || consultation.images.length > 0) && (
            <Grid item xs={12}>
              <StyledCard 
                icon={<ScienceIcon sx={{ color: '#005F73' }} />}  // Icône bleu foncé
                title="Requested Exams"
                color="info"
                darkMode={darkMode}
                sx={{
                  backgroundColor: "#ffffff",
                  border: '2px solid #e0e0e0',
                }}
              >
                {consultation.tests.length > 0 && (
                  <SoftBox mb={2}>
                    <SoftTypography 
                      variant="caption" 
                      fontWeight="bold" 
                      display="block" 
                      gutterBottom
                      color="#005F73"  // Texte bleu foncé
                    >
                      LABORATORY TESTS
                    </SoftTypography>
                    {consultation.tests.map((test, index) => (
                      <TestItem key={`test-${index}`} test={test} darkMode={darkMode} />
                    ))}
                  </SoftBox>
                )}

                {consultation.images.length > 0 && (
                  <SoftBox>
                    <SoftTypography 
                      variant="caption" 
                      fontWeight="bold" 
                      display="block" 
                      gutterBottom
                      color="#005F73"  // Texte bleu foncé
                    >
                      IMAGING STUDIES
                    </SoftTypography>
                    {consultation.images.map((image, index) => (
                      <ImageItem key={`image-${index}`} image={image} darkMode={darkMode} />
                    ))}
                  </SoftBox>
                )}
              </StyledCard>
            </Grid>
          )}

          {/* Doctor's Notes */}
          {consultation.notes && (
            <Grid item xs={12}>
              <StyledCard 
                icon={<NotesIcon sx={{ color: '#005F73' }} />}  // Icône bleu foncé
                title="Doctor's Notes"
                color="info"
                darkMode={darkMode}
                sx={{
                  backgroundColor: "#ffffff",
                  border: '2px solid #e0e0e0',
                }}
              >
                <SoftTypography variant="button" fontWeight="regular" color="text.secondary">
                  {consultation.notes}
                </SoftTypography>
              </StyledCard>
            </Grid>
          )}
        </Grid>
      </SoftBox>
    </Card>
  );
};

ConsultationCard.propTypes = {
  consultation: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    doctor: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    diagnosis: PropTypes.string.isRequired,
    treatments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        dosage: PropTypes.string.isRequired,
        frequency: PropTypes.string.isRequired
      })
    ).isRequired,
    tests: PropTypes.arrayOf(PropTypes.string).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    notes: PropTypes.string
  }).isRequired,
  darkMode: PropTypes.bool.isRequired
};

const PatientConsultations = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  
  // Stats data
  const statsData = {
    totalConsultations: "12",
    lastVisit: "June 15, 2023",
    upcomingAppointments: "2",
    mostVisitedSpecialty: "Cardiology"
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox 
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%)"
            : "url('https://via.placeholder.com/1920x1080?text=Medical-Background'), linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: { xs: 2, md: 4 },
          color: darkMode ? "#e0e0e0" : "#1a2a3a",
        }}
      >
        <SoftBox px={3}>
          <SoftBox 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            mb={4}
            p={2}
            sx={{
              background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}
          >
            <SoftBox display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ 
  bgcolor: "#002b5c", 
  color: "#ffffff", 
  border: "2px solid white", 
  width: 48, 
  height: 48 
}}>
  <MedicalServicesIcon fontSize="large" />
</Avatar>
              <SoftBox>
                <SoftTypography variant="h6" color={darkMode ? "gray" : "text.secondary"}>
                  Medical History
                </SoftTypography>
                <SoftTypography variant="h4" fontWeight="bold" color={darkMode ? "white" : "dark"}>
                  My Consultations
                </SoftTypography>
              </SoftBox>
            </SoftBox>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
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

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <TrendsCard data={consultationTrends} darkMode={darkMode} />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatsCard stats={statsData} darkMode={darkMode} />
            </Grid>
          </Grid>

          <SoftBox mb={4}>
            <SoftTypography 
              variant="h5" 
              fontWeight="bold" 
              gutterBottom
              color={darkMode ? "white" : "dark"}
            >
              <EventIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Consultation History
            </SoftTypography>
            <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"} paragraph>
              Review your complete consultation history with detailed visit information.
            </SoftTypography>
          </SoftBox>

          <SoftBox>
            {consultationsData.map((consultation) => (
              <ConsultationCard 
                key={consultation.id} 
                consultation={consultation} 
                darkMode={darkMode} 
              />
            ))}
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default PatientConsultations;