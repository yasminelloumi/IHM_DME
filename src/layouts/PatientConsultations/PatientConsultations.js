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
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { getDMEByPatientId, createDME } from "../../services/dmeService";
import { getById } from "../../services/medecinService";
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
  LightMode
} from '@mui/icons-material';
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { FormControlLabel, Switch } from "@mui/material";
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

const ConsultationCard = ({ consultation, darkMode }) => {
  return (
    <Card sx={{
      mb: 4,
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      background: "#ffffff"
    }}>
      <SoftBox
        p={3}
        bgcolor="#005F73"
        color="white"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <SoftBox display="flex" alignItems="center">
          <EventIcon sx={{ mr: 1, color: "#ffffff" }} />
          <SoftTypography variant="h6" fontWeight="bold">
            {consultation.date}
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
          <Grid item xs={12} md={6}>
            <StyledCard
              icon={<DescriptionIcon sx={{ color: '#005F73' }} />}
              title="Reason for Visit"
              color="info"
              darkMode={darkMode}
              sx={{
                backgroundColor: "#ffffff",
                border: '2px solid #e0e0e0',
              }}
            >
              <SoftTypography variant="button" fontWeight="regular" color="text.secondary">
                {consultation.reason}
              </SoftTypography>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard
              icon={<DiagnosesIcon sx={{ color: '#005F73' }} />}
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

          {consultation.treatments.length > 0 && (
            <Grid item xs={12}>
              <StyledCard
                icon={<MedicalServicesIcon sx={{ color: '#005F73' }} />}
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

          {(consultation.tests.length > 0 || consultation.images.length > 0) && (
            <Grid item xs={12}>
              <StyledCard
                icon={<ScienceIcon sx={{ color: '#005F73' }} />}
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
                      color="#005F73"
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
                      color="#005F73"
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

          {consultation.notes && (
            <Grid item xs={12}>
              <StyledCard
                icon={<NotesIcon sx={{ color: '#005F73' }} />}
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
    doctor: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    diagnosis: PropTypes.string.isRequired,
    treatments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    tests: PropTypes.arrayOf(PropTypes.string).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    notes: PropTypes.string
  }).isRequired,
  darkMode: PropTypes.bool.isRequired
};

const PatientConsultations = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dmeRecords, setDmeRecords] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    totalConsultations: "0",
    lastVisit: "No visits",
    upcomingAppointments: "0",
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

  const handleInputChange = (e) =>  {
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
          imgTest: formData.imgTest.split(",").map(i => i.trim()).filter(Boolean),
          notes: formData.notes
        };
      
      const result = await createDME(dmeData);
      if (result) {
        console.log("DME created:", result);
        // Optionally refresh data or show a success message
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
        dateConsultation: "", // ✅ fix
        reason: "",
        diagnosis: "",
        treatments: "",
        laboTest: "", // ✅ fix, it was tests before
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
    const fetchDME = async () => {
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

        const consultations = dmeInstances.map(dme => {
          const doctor = doctorsMap[dme.medecinId] || { prenom: 'Unknown', nom: 'Doctor', specialite: 'Unknown' };
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
            tests: dme.laboTest || [],
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
          upcomingAppointments: "0",
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
        console.error("Error loading DME records:", error);
        setError(error.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDME();
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

  const consultationsToDisplay = dmeRecords.map(dme => {
    const doctor = doctors[dme.medecinId] || { prenom: 'Unknown', nom: 'Doctor', specialite: 'Unknown' };
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
      tests: dme.laboTest || [],
      images: dme.imgTest || [],
      notes: dme.notes || ''
    };
  });

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
            <SoftButton
              variant="outlined"
              size="small"
              color="info"
              onClick={handleOpenModal}
            >
              Add Consultation
            </SoftButton>
          </SoftBox>

          <SoftBox>
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
          </SoftBox>
        </SoftBox>
      </SoftBox>

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