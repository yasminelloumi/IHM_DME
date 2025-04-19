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
  Science as ScienceIcon,
  InsertPhoto as InsertPhotoIcon,
  Notes as NotesIcon,
  Healing as DiagnosesIcon,
  Description as DescriptionIcon,
  Person as DoctorIcon,
  DarkMode,
  LightMode,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  PictureAsPdf as PdfIcon,
  Description as ReportIcon,
  Visibility as RadiologyIcon
} from '@mui/icons-material';
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { FormControlLabel, Switch, Button, Dialog, DialogContent, DialogActions, Box, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

// Enhanced Medical Imaging Data
const medicalImagingStudies = [
  {
    id: 1,
    studyType: "X-ray",
    modality: "Chest PA",
    date: "06/12/2023",
    imagingCenter: "Metropolitan Radiology Center",
    referringPhysician: "Dr. Smith",
    status: "Completed",
    findings: "No acute cardiopulmonary findings",
    impression: "Normal chest x-ray",
    imageUrl: "https://example.com/xray-chest.jpg",
    thumbnail: "https://via.placeholder.com/150?text=Chest+X-ray",
    reportUrl: "https://example.com/report1.pdf",
    dicomUrl: "https://example.com/dicom1.zip"
  },
  {
    id: 2,
    studyType: "MRI",
    modality: "Brain with Contrast",
    date: "05/05/2023",
    imagingCenter: "Neuro Imaging Institute",
    referringPhysician: "Dr. Johnson",
    status: "Completed",
    findings: "No evidence of acute intracranial abnormality",
    impression: "Unremarkable brain MRI",
    imageUrl: "https://example.com/mri-brain.jpg",
    thumbnail: "https://via.placeholder.com/150?text=Brain+MRI",
    reportUrl: "https://example.com/report2.pdf",
    dicomUrl: "https://example.com/dicom2.zip"
  }
];

const labTests = [
  {
    id: 1,
    name: "Complete Blood Count",
    date: "06/10/2023",
    lab: "BioLab Diagnostics",
    result: "Normal",
    reportUrl: "https://example.com/lab-report1.pdf"
  },
  {
    id: 2,
    name: "Cholesterol Panel",
    date: "05/08/2023",
    lab: "MediTest Laboratories",
    result: "Elevated LDL",
    reportUrl: "https://example.com/lab-report2.pdf"
  }
];

// Updated consultations data
const consultationsData = [
  {
    id: 1,
    date: "06/15/2023",
    time: "10:30 AM",
    doctor: "Dr. Smith",
    specialty: "Cardiology",
    reason: "Chest pain evaluation",
    diagnosis: "Hypertension (Stage 1)",
    treatments: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
      { name: "Blood pressure monitoring", frequency: "Twice daily" }
    ],
    labTests: labTests,
    imagingStudies: medicalImagingStudies,
    notes: "Patient advised to reduce sodium intake and exercise regularly. Follow-up in 3 months."
  },
  {
    id: 2,
    date: "05/10/2023",
    time: "2:15 PM",
    doctor: "Dr. Johnson",
    specialty: "Primary Care",
    reason: "Annual physical examination",
    diagnosis: "Normal health status",
    treatments: [],
    labTests: [labTests[1]],
    imagingStudies: [],
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

// Enhanced Medical Imaging Study Card
// Enhanced Medical Imaging Study Card
const ImagingStudyCard = ({ study, darkMode }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Card sx={{
      mb: 2,
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      background: darkMode ? "#34495e" : "#f8f9fa",
      transition: "transform 0.2s",
      '&:hover': {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
      }
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <RadiologyIcon color={darkMode ? "secondary" : "info"} sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color={darkMode ? "white" : "dark"}>
            {study.studyType} - {study.modality}
          </Typography>
        </Box>
        
        <Box mb={2}>
          <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
            <strong>Imaging Center:</strong> {study.imagingCenter}
          </Typography>
          <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
            <strong>Date:</strong> {study.date}
          </Typography>
          <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
            <strong>Referring Physician:</strong> {study.referringPhysician}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> 
            <span style={{ 
              color: study.status === 'Completed' ? 
                (darkMode ? "#81c784" : "#2e7d32") : 
                (darkMode ? "#ff8a65" : "#d84315"),
              fontWeight: "bold",
              marginLeft: "4px"
            }}>
              {study.status}
            </span>
          </Typography>
        </Box>

        <Box sx={{ 
          height: 140,
          backgroundImage: `url(${study.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "8px",
          mb: 2,
          cursor: "pointer",
          position: "relative"
        }} onClick={() => setOpen(true)}>
          <Box sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(0,0,0,0.7)",
            color: "white",
            p: 1,
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px"
          }}>
            <Typography variant="caption">
              {study.studyType} - Click to view
            </Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            size="small"
            startIcon={<PdfIcon sx={{ fontSize: '1rem' }} />}
            href={study.reportUrl}
            target="_blank"
            sx={{
              color: darkMode ? "#ef9a9a" : "#d32f2f",
              borderColor: darkMode ? "#ef9a9a" : "#d32f2f",
              fontSize: '0.75rem',
              padding: '4px 8px',
              minWidth: 'auto'
            }}
          >
            Radiology Report
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon sx={{ fontSize: '1rem' }} />}
            href={study.dicomUrl}
            sx={{
              color: darkMode ? "#a5d6a7" : "#388e3c",
              borderColor: darkMode ? "#a5d6a7" : "#388e3c",
              fontSize: '0.75rem',
              padding: '4px 8px',
              minWidth: 'auto'
            }}
          >
            Download Files
          </Button>
        </Box>
      </CardContent>

      {/* Study Viewer Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ 
            height: '400px',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}>
            <img 
              src={study.imageUrl} 
              alt={study.studyType}
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }} 
            />
          </Box>
          
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              Study Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Study Type:</strong> {study.studyType}
                </Typography>
                <Typography variant="body2">
                  <strong>Modality:</strong> {study.modality}
                </Typography>
                <Typography variant="body2">
                  <strong>Imaging Center:</strong> {study.imagingCenter}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Study Date:</strong> {study.date}
                </Typography>
                <Typography variant="body2">
                  <strong>Referring Physician:</strong> {study.referringPhysician}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {study.status}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Clinical Findings
            </Typography>
            <Typography variant="body2" paragraph>
              {study.findings}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Radiologist Impression
            </Typography>
            <Typography variant="body2">
              {study.impression}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpen(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

ImagingStudyCard.propTypes = {
  study: PropTypes.shape({
    id: PropTypes.number.isRequired,
    studyType: PropTypes.string.isRequired,
    modality: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    imagingCenter: PropTypes.string.isRequired,
    referringPhysician: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    findings: PropTypes.string.isRequired,
    impression: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    reportUrl: PropTypes.string.isRequired,
    dicomUrl: PropTypes.string.isRequired
  }).isRequired,
  darkMode: PropTypes.bool.isRequired
};

// Lab Test Card component
const LabTestCard = ({ test, darkMode }) => {
  return (
    <Card sx={{
      mb: 2,
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      background: darkMode ? "#34495e" : "#f8f9fa",
      transition: "transform 0.2s",
      '&:hover': {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
      }
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <ScienceIcon color={darkMode ? "secondary" : "secondary"} sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color={darkMode ? "white" : "dark"}>
            {test.name}
          </Typography>
        </Box>
        
        <Box mb={1}>
          <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
            <strong>Date:</strong> {test.date}
          </Typography>
          <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
            <strong>Lab:</strong> {test.lab}
          </Typography>
          <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
            <strong>Result:</strong> 
            <span style={{ 
              color: test.result === "Normal" ? 
                (darkMode ? "#81c784" : "#2e7d32") : 
                (darkMode ? "#ff8a65" : "#d84315"),
              fontWeight: "bold",
              marginLeft: "4px"
            }}>
              {test.result}
            </span>
          </Typography>
        </Box>
        
        <Button
          fullWidth
          variant="contained"
          size="small"
          startIcon={<ReportIcon />}
          href={test.reportUrl}
          target="_blank"
          sx={{
            mt: 1,
            backgroundColor: darkMode ? "#005F73" : "#0077b6",
            '&:hover': {
              backgroundColor: darkMode ? "#004b5d" : "#005f8c"
            }
          }}
        >
          View Lab Report
        </Button>
      </CardContent>
    </Card>
  );
};

LabTestCard.propTypes = {
  test: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    lab: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
    reportUrl: PropTypes.string.isRequired
  }).isRequired,
  darkMode: PropTypes.bool.isRequired
};

// Updated ConsultationCard component
const ConsultationCard = ({ consultation, darkMode }) => {
  return (
    <Card sx={{ 
      mb: 4,
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      background: darkMode ? "#2c3e50" : "#ffffff"
    }}>
      {/* Header section */}
      <Box 
        p={3} 
        bgcolor={darkMode ? "#005F73" : "#0077b6"}
        color="white"
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        flexWrap="wrap"
      >
        <Box display="flex" alignItems="center">
          <EventIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            {consultation.date} at {consultation.time}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <DoctorIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="medium">
            {consultation.doctor} ({consultation.specialty})
          </Typography>
        </Box>
      </Box>

      <Box p={3}>
        <Grid container spacing={3}>
          {/* Reason and Diagnosis */}
          <Grid item xs={12} md={6}>
            <StyledCard 
              icon={<DescriptionIcon sx={{ color: darkMode ? '#90caf9' : '#0077b6' }} />}
              title="Reason for Visit"
              color="info"
              darkMode={darkMode}
            >
              <Typography variant="body1" color={darkMode ? "white" : "dark"}>
                {consultation.reason}
              </Typography>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard 
              icon={<DiagnosesIcon sx={{ color: darkMode ? '#90caf9' : '#0077b6' }} />}
              title="Diagnosis"
              color="info"
              darkMode={darkMode}
            >
              <Typography variant="body1" color={darkMode ? "white" : "dark"}>
                {consultation.diagnosis}
              </Typography>
            </StyledCard>
          </Grid>

          {/* Treatments */}
          {consultation.treatments.length > 0 && (
            <Grid item xs={12}>
              <StyledCard 
                icon={<MedicalServicesIcon sx={{ color: darkMode ? '#90caf9' : '#0077b6' }} />}
                title="Prescribed Treatments"
                color="info"
                darkMode={darkMode}
              >
                {consultation.treatments.map((treatment, index) => (
                  <TreatmentItem key={index} treatment={treatment} darkMode={darkMode} />
                ))}
              </StyledCard>
            </Grid>
          )}

          {/* Tests and Imaging Studies */}
          {(consultation.labTests.length > 0 || consultation.imagingStudies.length > 0) && (
            <Grid item xs={12}>
              <StyledCard 
                icon={<ScienceIcon sx={{ color: darkMode ? '#90caf9' : '#0077b6' }} />}
                title="Diagnostic Studies"
                color="info"
                darkMode={darkMode}
              >
                <Grid container spacing={2}>
                  {/* Laboratory Tests Section */}
                  {consultation.labTests.length > 0 && (
                    <Grid item xs={12} md={consultation.imagingStudies.length > 0 ? 6 : 12}>
                      <Box 
                        sx={{
                          p: 2,
                          borderRadius: "8px",
                          background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 119, 182, 0.05)",
                          borderLeft: `4px solid ${darkMode ? "#90caf9" : "#0077b6"}`
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          gutterBottom
                          color={darkMode ? "white" : "dark"}
                          display="flex"
                          alignItems="center"
                        >
                          <ScienceIcon sx={{ mr: 1, color: darkMode ? "#90caf9" : "#0077b6" }} />
                          LABORATORY TESTS
                        </Typography>
                        {consultation.labTests.map((test) => (
                          <LabTestCard key={`test-${test.id}`} test={test} darkMode={darkMode} />
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {/* Medical Imaging Section */}
                  {consultation.imagingStudies.length > 0 && (
                    <Grid item xs={12} md={consultation.labTests.length > 0 ? 6 : 12}>
                      <Box 
                        sx={{
                          p: 2,
                          borderRadius: "8px",
                          background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 119, 182, 0.05)",
                          borderLeft: `4px solid ${darkMode ? "#90caf9" : "#0077b6"}`
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          fontWeight="bold" 
                          gutterBottom
                          color={darkMode ? "white" : "dark"}
                          display="flex"
                          alignItems="center"
                        >
                          <RadiologyIcon sx={{ mr: 1, color: darkMode ? "#90caf9" : "#0077b6" }} />
                          MEDICAL IMAGING CENTER RESULTS
                        </Typography>
                        <Grid container spacing={2}>
                          {consultation.imagingStudies.map((study) => (
                            <Grid item xs={12} sm={6} key={`study-${study.id}`}>
                              <ImagingStudyCard study={study} darkMode={darkMode} />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </StyledCard>
            </Grid>
          )}

          {/* Doctor's Notes */}
          {consultation.notes && (
            <Grid item xs={12}>
              <StyledCard 
                icon={<NotesIcon sx={{ color: darkMode ? '#90caf9' : '#0077b6' }} />}
                title="Clinical Notes"
                color="info"
                darkMode={darkMode}
              >
                <Typography variant="body1" color={darkMode ? "white" : "dark"}>
                  {consultation.notes}
                </Typography>
              </StyledCard>
            </Grid>
          )}
        </Grid>
      </Box>
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
    labTests: PropTypes.array.isRequired,
    imagingStudies: PropTypes.array.isRequired,
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
      <Box 
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%)"
            : "linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
          padding: { xs: 2, md: 4 },
          color: darkMode ? "#e0e0e0" : "#1a2a3a",
        }}
      >
        <Box px={3}>
          <Box 
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
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ 
                bgcolor: "#002b5c", 
                color: "#ffffff", 
                border: "2px solid white", 
                width: 48, 
                height: 48 
              }}>
                <MedicalServicesIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6" color={darkMode ? "gray" : "text.secondary"}>
                  Medical History
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={darkMode ? "white" : "dark"}>
                  My Consultations
                </Typography>
              </Box>
            </Box>
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
                <Box display="flex" alignItems="center" gap={1}>
                  {darkMode ? (
                    <DarkMode sx={{ color: "#e0e0e0" }} />
                  ) : (
                    <LightMode sx={{ color: "#f9a825" }} />
                  )}
                  <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
                    Theme
                  </Typography>
                </Box>
              }
              labelPlacement="start"
              sx={{ margin: 0 }}
            />
          </Box>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
              <TrendsCard data={consultationTrends} darkMode={darkMode} />
            </Grid>
            <Grid item xs={12} md={6}>
              <StatsCard stats={statsData} darkMode={darkMode} />
            </Grid>
          </Grid>

          <Box mb={4}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              gutterBottom
              color={darkMode ? "white" : "dark"}
            >
              <EventIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Consultation History
            </Typography>
            <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"} paragraph>
              Review your complete consultation history with detailed visit information.
            </Typography>
          </Box>

          <Box>
            {consultationsData.map((consultation) => (
              <ConsultationCard 
                key={consultation.id} 
                consultation={consultation} 
                darkMode={darkMode} 
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Footer />
    </DashboardLayout>
  );
};

export default PatientConsultations;