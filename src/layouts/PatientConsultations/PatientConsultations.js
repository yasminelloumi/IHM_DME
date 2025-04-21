import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftButton from "components/SoftButton";
import Footer from "examples/Footer";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { getDMEByPatientId, createDME } from "../../services/dmeService";
import { getById } from "../../services/medecinService";
import { getReportsByPatient } from "../../services/reportsServices";
import DME from '../../models/DME';
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
  PictureAsPdf as PdfIcon,
  Description as ReportIcon,
  Visibility as RadiologyIcon
} from '@mui/icons-material';
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { FormControlLabel, Switch, Button, Dialog, DialogContent, DialogActions, Box, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const modalStyle = (darkMode) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '700px' },
  bgcolor: darkMode ? '#2c3e50' : 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  color: darkMode ? '#e0e0e0' : '#1a2a3a',
  maxHeight: '90vh',
  overflowY: 'auto'
});

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

const TreatmentItem = ({ treatment, darkMode }) => (
  <SoftBox display="flex" alignItems="center" mb={1} pl={2}>
    <MedicalServicesIcon color={darkMode ? "secondary" : "primary"} fontSize="small" sx={{ mr: 1 }} />
    <SoftTypography variant="button" fontWeight="regular" color={darkMode ? "white" : "dark"}>
      {treatment.name}
    </SoftTypography>
  </SoftBox>
);

TreatmentItem.propTypes = {
  treatment: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired
};

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

const LabTestCard = ({ test, darkMode }) => {
  const handleViewReport = (e) => {
    if (!test.filePath) {
      e.preventDefault();
      return;
    }
    console.log('Opening PDF:', test.filePath); // Debug log
    window.open(test.filePath, '_blank');
  };

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
            {test.labTest}
          </Typography>
        </Box>
        
        <Box mb={1}>
          <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
            <strong>Test Date:</strong> {new Date(test.timestamp).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
            <strong>Result:</strong> 
            <span style={{ 
              color: test.description === "Normal" ? 
                (darkMode ? "#81c784" : "#2e7d32") : 
                (darkMode ? "#ff8a65" : "#d84315"),
              fontWeight: "bold",
              marginLeft: "4px"
            }}>
              {test.description}
            </span>
          </Typography>
        </Box>
        
        <Button
          fullWidth
          variant="contained"
          size="small"
          startIcon={<ReportIcon />}
          onClick={handleViewReport}
          disabled={!test.filePath}
          sx={{
            mt: 1,
            backgroundColor: darkMode ? "#005F73" : "#0077b6",
            '&:hover': {
              backgroundColor: darkMode ? "#004b5d" : "#005f8c"
            },
            '&.Mui-disabled': {
              backgroundColor: darkMode ? "#4b5e6f" : "#b0bec5",
              color: darkMode ? "#78909c" : "#90a4ae"
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
    labTest: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    filePath: PropTypes.string
  }).isRequired,
  darkMode: PropTypes.bool.isRequired
};

const ConsultationCard = ({ consultation, darkMode }) => {
  return (
    <Card sx={{
      mb: 4,
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      background: darkMode ? "#2c3e50" : "#ffffff"
    }}>
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
            {consultation.date}
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

          {(consultation.tests.length > 0 || consultation.images.length > 0) && (
            <Grid item xs={12}>
              <StyledCard
                icon={<ScienceIcon sx={{ color: darkMode ? '#90caf9' : '#0077b6' }} />}
                title="Requested Exams"
                color="info"
                darkMode={darkMode}
              >
                <Grid container spacing={2}>
                  {consultation.tests.length > 0 && (
                    <Grid item xs={12} md={consultation.images.length > 0 ? 6 : 12}>
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
                      {consultation.tests.map((test) => (
                        <LabTestCard key={`test-${test.id}`} test={test} darkMode={darkMode} />
                      ))}
                    </Grid>
                  )}

                  {consultation.images.length > 0 && (
                    <Grid item xs={12} md={consultation.tests.length > 0 ? 6 : 12}>
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
                          {consultation.images.map((study) => (
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

          {consultation.notes && (
            <Grid item xs={12}>
              <StyledCard 
                icon={<NotesIcon sx={{ color: darkMode ? '#90caf9' : '#0077b6' }} />}
                title="Notes"
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
    doctor: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    diagnosis: PropTypes.string.isRequired,
    treatments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    tests: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        labTest: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        filePath: PropTypes.string
      })
    ).isRequired,
    images: PropTypes.array.isRequired,
    notes: PropTypes.string
  }).isRequired,
  darkMode: PropTypes.bool.isRequired
};

const PatientConsultations = () => {
  const user = JSON.parse(localStorage.getItem("connectedUser"));
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dmeRecords, setDmeRecords] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    totalConsultations: "0",
    lastVisit: "No visits",
    mostVisitedSpecialty: "None"
  });
  const [consultationTrends, setConsultationTrends] = useState([]);
  const [formData, setFormData] = useState({
    dateConsultation: "",
    reason: "",
    diagnosis: "",
    treatments: "",
    laboTest: "",
    imgTest: "",
    notes: ""
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      dateConsultation: "",
      reason: "",
      diagnosis: "",
      treatments: "",
      laboTest: "",
      imgTest: "",
      notes: ""
    });
    setSubmitStatus(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");

    try {
      const user = JSON.parse(localStorage.getItem("connectedUser")) || {};
      const scannedPatient = JSON.parse(localStorage.getItem("scannedPatient")) || {};

      const dateConsultation = formData.dateConsultation
        ? new Date(formData.dateConsultation).toISOString()
        : null;

      const dmeData = {
        patientId: scannedPatient.id,
        medecinId: user.id,
        dateConsultation: new Date(formData.dateConsultation).toISOString(),
        reason: formData.reason,
        diagnostiques: formData.diagnosis.split(",").map(d => d.trim()).filter(Boolean),
        ordonnances: formData.treatments.split("\n").map(t => t.trim()).filter(Boolean),
        laboTest: formData.laboTest.split(",").map(t => t.trim()).filter(Boolean),
        imgTest: formData.imgTest.split(",").map(i => t.trim()).filter(Boolean),
        notes: formData.notes
      };
      
      const result = await createDME(dmeData);
      if (result) {
        console.log("DME created:", result);
      } else {
        console.error("Failed to create DME");
      }
      const refreshedRecords = await getDMEByPatientId(scannedPatient.id);
      setDmeRecords(refreshedRecords.map(dme => new DME(
        dme.id,
        dme.patientId,
        dme.medecinId,
        dme.dateConsultation,
        dme.reason,
        dme.diagnostiques,
        dme.ordonnances,
        dme.laboTest,
        dme.imgTest,
        dme.notes
      )));

      setSubmitStatus("success");
      setFormData({
        dateConsultation: "",
        reason: "",
        diagnosis: "",
        treatments: "",
        laboTest: "",
        imgTest: "",
        notes: ""
      });
      setTimeout(handleCloseModal, 1500);
    } catch (error) {
      console.error("Error submitting DME:", error);
      setSubmitStatus("error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("connectedUser"));
        if (!user) {
          throw new Error("No connected user found");
        }
        let patientId = null;
        if (user.role === "patient") {
          patientId = user.id;
        } else if (["medecins", "laboratoire", "centreImagerie"].includes(user.role)) {
          const scannedPatient = JSON.parse(localStorage.getItem("scannedPatient"));
          if (!scannedPatient) {
            throw new Error("No scanned patient found");
          }
          patientId = scannedPatient.id;
        }
        if (!patientId) {
          throw new Error("No patient ID found");
        }
        const response = await getDMEByPatientId(patientId);
        if (!response) {
          throw new Error("Failed to fetch DME records");
        }
        const dmeInstances = response.map(dme => new DME(
          dme.id,
          dme.patientId,
          dme.medecinId,
          dme.dateConsultation,
          dme.reason,
          dme.diagnostiques,
          dme.ordonnances,
          dme.laboTest,
          dme.imgTest,
          dme.notes
        ));
        const uniqueMedecinIds = [...new Set(dmeInstances.map(dme => dme.medecinId))];
        const doctorPromises = uniqueMedecinIds.map(async (id) => {
          try {
            const doctor = await getById(id);
            return { id, doctor };
          } catch (error) {
            console.warn(`Failed to fetch doctor with ID ${id}:`, error);
            return { id, doctor: null };
          }
        });
        const doctorResults = await Promise.all(doctorPromises);
        const doctorsMap = doctorResults.reduce((acc, { id, doctor }) => {
          if (doctor) {
            acc[id] = doctor;
          }
          return acc;
        }, {});
        setDoctors(doctorsMap);
        setDmeRecords(dmeInstances);
        const reportsResponse = await getReportsByPatient(patientId);
        if (!reportsResponse) {
          throw new Error("Failed to fetch laboratory tests");
        }
        // Ensure filePath uses port 3002
        const modifiedReports = reportsResponse.map(report => ({
          ...report,
          filePath: report.filePath && !report.filePath.startsWith('http')
            ? `http://localhost:3002${report.filePath}`
            : report.filePath.replace('http://localhost:3000', 'http://localhost:3002')
        }));
        setReports(modifiedReports);
        const consultations = dmeInstances.map(dme => {
          const doctor = doctorsMap[dme.medecinId] || { prenom: 'Unknown', nom: 'Doctor', specialite: 'Unknown' };
          const associatedReports = modifiedReports.filter(report => 
            dme.laboTest.includes(report.labTest)
          );
          return {
            id: dme.id,
            date: new Date(dme.dateConsultation).toLocaleDateString(),
            doctor: `Dr. ${doctor.prenom} ${doctor.nom}`,
            specialty: doctor.specialite,
            reason: dme.reason,
            diagnosis: dme.diagnostiques.join(", "),
            treatments: Array.isArray(dme.ordonnances)
              ? dme.ordonnances.map(med => ({
                  name: typeof med === 'string' ? med : med.name || '',
                }))
              : [],
            tests: Array.isArray(associatedReports)
              ? associatedReports.map(report => ({
                  id: report.id || Math.random(),
                  labTest: report.labTest || 'Unknown Test',
                  timestamp: report.timestamp || new Date(dme.dateConsultation).toISOString(),
                  description: report.description || 'Pending',
                  filePath: report.filePath
                }))
              : [],
            images: dme.imgTest || [],
            notes: dme.notes || ""
          };
        });
        const totalConsultations = dmeInstances.length;
        const lastVisit = totalConsultations > 0
          ? new Date(dmeInstances[0].dateConsultation).toLocaleDateString()
          : "No visits";
        const specialtyCounts = consultations.reduce((acc, curr) => {
          acc[curr.specialty] = (acc[curr.specialty] || 0) + 1;
          return acc;
        }, {});
        const mostVisitedSpecialty = Object.keys(specialtyCounts).length > 0
          ? Object.entries(specialtyCounts).sort((a, b) => b[1] - a[1])[0][0]
          : "None";
        setStatsData({
          totalConsultations: totalConsultations.toString(),
          lastVisit,
          mostVisitedSpecialty
        });
        const monthlyCounts = dmeInstances.reduce((acc, record) => {
          try {
            const month = new Date(record.dateConsultation).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
          } catch (e) {
            console.error("Error processing date:", record.dateConsultation);
          }
          return acc;
        }, {});
        setConsultationTrends(
          Object.entries(monthlyCounts)
            .map(([month, count]) => ({ month, consultations: count }))
            .sort((a, b) => new Date(`1 ${a.month} 2023`) - new Date(`1 ${b.month} 2023`))
        );
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" height="80vh">
          <SoftTypography variant="h5">Loading patient data...</SoftTypography>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" height="80vh">
          <SoftTypography variant="h5" color="error">Error: {error}</SoftTypography>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  const consultationsToDisplay = dmeRecords
    .sort((a, b) => new Date(b.dateConsultation) - new Date(a.dateConsultation))
    .map(dme => {
      const doctor = doctors[dme.medecinId] || { prenom: 'Unknown', nom: 'Doctor', specialite: 'Unknown' };
      const associatedReports = reports.filter(report => 
        dme.laboTest.includes(report.labTest)
      );
      return {
        id: dme.id,
        date: new Date(dme.dateConsultation).toLocaleDateString(),
        doctor: `Dr. ${doctor.prenom} ${doctor.nom}`,
        specialty: doctor.specialite,
        reason: dme.reason,
        diagnosis: dme.diagnostiques.join(", "),
        treatments: Array.isArray(dme.ordonnances)
          ? dme.ordonnances.map(med => ({
              name: typeof med === 'string' ? med : med.name || '',
            }))
          : [],
        tests: Array.isArray(associatedReports)
          ? associatedReports.map(report => ({
              id: report.id || Math.random(),
              labTest: report.labTest || 'Unknown Test',
              timestamp: report.timestamp || new Date(dme.dateConsultation).toISOString(),
              description: report.description || 'Pending',
              filePath: report.filePath
            }))
          : [],
        images: dme.imgTest || [],
        notes: dme.notes || ''
      };
    });

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
              {user?.role === "patient"
                ? "Review your complete consultation history with detailed visit information."
                : "Review the complete consultation of the patient's history with detailed visit information."}
            </Typography>
            {user?.role !== "patient" && (
              <SoftButton
                variant="outlined"
                size="small"
                color="info"
                onClick={handleOpenModal}
              >
                Add Consultation
              </SoftButton>
            )}
          </Box>

          <Box mb={4}>
            {consultationsToDisplay.length > 0 ? (
              consultationsToDisplay.map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <SoftTypography variant="body1" color={darkMode ? "white" : "dark"}>
                No consultation records found for this patient.
              </SoftTypography>
            )}
          </Box>
        </Box>
      </Box>

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="consultation-modal-title"
      >
        <Box sx={modalStyle(darkMode)}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <SoftTypography
              id="consultation-modal-title"
              variant="h5"
              fontWeight="bold"
              color={darkMode ? "white" : "dark"}
            >
              <MedicalServicesIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              New Medical Consultation
            </SoftTypography>
            
            <SoftBox 
              sx={{
                background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
                padding: '8px 12px',
                textAlign: 'right'
              }}
            >
              {(() => {
                const user = JSON.parse(localStorage.getItem("connectedUser")) || {};
                const scannedPatient = JSON.parse(localStorage.getItem("scannedPatient")) || {};
                return (
                  <>
                    <SoftTypography variant="caption" display="block" color={darkMode ? "gray" : "text.secondary"}>
                      Doctor: {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : 'Unknown'}
                    </SoftTypography>
                    <SoftTypography variant="caption" display="block" color={darkMode ? "gray" : "text.secondary"}>
                      Patient ID: {scannedPatient.id || 'N/A'}
                    </SoftTypography>
                  </>
                );
              })()}
            </SoftBox>
          </SoftBox>

          {submitStatus === "success" && (
            <SoftBox mb={2} p={2} bgcolor="success.light" borderRadius="8px">
              <SoftTypography variant="body2" color="success.main">
                Consultation saved successfully!
              </SoftTypography>
            </SoftBox>
          )}
          {submitStatus === "error" && (
            <SoftBox mb={2} p={2} bgcolor="error.light" borderRadius="8px">
              <SoftTypography variant="body2" color="error.main">
                Failed to save consultation. Please try again.
              </SoftTypography>
            </SoftBox>
          )}

          <form onSubmit={handleFormSubmit}>
            <Box mb={3}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                name="dateConsultation"
                id="date"
                required
                value={formData.dateConsultation}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", fontSize: "1rem" }}
              />
            </Box>

            <Box mb={3}>
              <label htmlFor="reason">Reason of Visit</label>
              <textarea
                name="reason"
                id="reason"
                rows="6"
                value={formData.reason}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontFamily: "Roboto",
                  fontSize: "1rem",
                  whiteSpace: "nowrap",
                  overflowX: "auto"
                }}
              />
            </Box>

            <Box mb={3}>
              <label htmlFor="diagnosis">Diagnosis (comma separated)</label>
              <textarea
                name="diagnosis"
                id="diagnosis"
                rows="5"
                required
                value={formData.diagnosis}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontFamily: "Roboto",
                  fontSize: "1rem",
                  whiteSpace: "nowrap",
                  overflowX: "auto"
                }}
              />
            </Box>

            <Box mb={3}>
              <label htmlFor="treatments">Prescribed Treatments (one per line)</label>
              <textarea
                name="treatments"
                id="treatments"
                rows="4"
                value={formData.treatments}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontFamily: "Roboto",
                  fontSize: "1rem",
                  whiteSpace: "nowrap",
                  overflowX: "auto"
                }}
              />
            </Box>

            <Box mb={3}>
              <label htmlFor="laboTest">Lab Tests (comma separated)</label>
              <input
                type="text"
                name="laboTest"
                id="laboTest"
                value={formData.laboTest}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontFamily: "Roboto",
                  fontSize: "1rem"
                }}
              />
            </Box>

            <Box mb={3}>
              <label htmlFor="imgTest">Imaging Tests (comma separated)</label>
              <input
                type="text"
                name="imgTest"
                id="imgTest"
                value={formData.imgTest}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontFamily: "Roboto",
                  fontSize: "1rem"
                }}
              />
            </Box>

            <Box mb={3}>
              <label htmlFor="notes">Doctor Notes</label>
              <textarea
                name="notes"
                id="notes"
                rows="6"
                value={formData.notes}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontFamily: "Roboto",
                  fontSize: "1rem",
                  whiteSpace: "nowrap",
                  overflowX: "auto"
                }}
              />
            </Box>

            <SoftBox mt={4} display="flex" justifyContent="flex-end">
              <SoftButton
                color="secondary"
                variant={darkMode ? "contained" : "outlined"}
                onClick={handleCloseModal}
                sx={{ mr: 2 }}
                disabled={submitStatus === "submitting"}
              >
                Cancel
              </SoftButton>
              <SoftButton
                color="info"
                variant="gradient"
                type="submit"
                disabled={submitStatus === "submitting"}
              >
                {submitStatus === "submitting" ? "Saving..." : "Save Consultation"}
              </SoftButton>
            </SoftBox>
          </form>
        </Box>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
};

export default PatientConsultations;