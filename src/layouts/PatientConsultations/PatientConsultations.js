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
import DME from '../../models/DME';
import {
  Event as EventIcon,
  MedicalServices as MedicalServicesIcon,
  Science as ScienceIcon,
  Notes as NotesIcon,
  Healing as DiagnosesIcon,
  Description as DescriptionIcon,
  Person as DoctorIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Visibility as VisibilityIcon,
  Image as ImageIcon,
  Print as PrintIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Pagination,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: '700px' },
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  color: '#1a2a3a',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const StyledCard = ({ children, icon, title, color = "primary" }) => (
  <Card sx={{
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: 2,
    background: "#fff",
    borderLeft: `4px solid`,
    borderLeftColor: `${color}.main`
  }}>
    <SoftBox p={2}>
      <SoftBox display="flex" alignItems="center" mb={2}>
        <Avatar sx={{
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          mr: 2,
          width: 40,
          height: 40
        }}>
          {icon}
        </Avatar>
        <SoftTypography variant="h6" fontWeight="bold" color="dark">
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
  color: PropTypes.string
};

const TreatmentItem = ({ treatment }) => (
  <SoftBox display="flex" alignItems="center" mb={1} pl={2}>
    <MedicalServicesIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
    <SoftTypography variant="button" fontWeight="regular" color="dark">
      {treatment.name}
    </SoftTypography>
  </SoftBox>
);

TreatmentItem.propTypes = {
  treatment: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired
};

const StatsCard = ({ stats }) => (
  <Card sx={{
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    background: "#fff",
    height: "100%"
  }}>
    <CardContent>
      <SoftTypography variant="h6" fontWeight="bold" mb={2} color="dark">
        Consultation Stats
      </SoftTypography>
      <SoftBox display="flex" flexDirection="column" gap={2}>
        {Object.entries(stats).map(([key, value]) => (
          <SoftBox key={key} display="flex" alignItems="center" gap={1}>
            <SoftTypography variant="body2" color="text.secondary" textTransform="uppercase">
              {key.replace(/([A-Z])/g, ' $1')}:
            </SoftTypography>
            <SoftTypography variant="body1" fontWeight="medium" color="dark">
              {value}
            </SoftTypography>
          </SoftBox>
        ))}
      </SoftBox>
    </CardContent>
  </Card>
);

StatsCard.propTypes = {
  stats: PropTypes.object.isRequired
};

const TrendsCard = ({ data }) => (
  <Card sx={{
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    background: "#fff",
    height: "100%"
  }}>
    <CardContent>
      <SoftTypography variant="h6" fontWeight="bold" mb={2} color="dark">
        Monthly Consultations
      </SoftTypography>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" stroke="#333" />
          <YAxis stroke="#333" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
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
            dot={{ fill: "#0077b6" }}
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
  ).isRequired
};

const ExamItem = ({ item, type, onClick }) => {
  const Icon = type === 'lab' ? ScienceIcon : MedicalServicesIcon;
  const isPending = item.result === "Pending" || item.status === "Pending";

  return (
    <Box
      onClick={() => !isPending && onClick(item)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        mb: 1,
        borderRadius: '8px',
        backgroundColor: 'background.paper',
        cursor: isPending ? 'default' : 'pointer',
        '&:hover': {
          backgroundColor: isPending ? 'background.paper' : '#e3f2fd',
          '& .MuiAvatar-root': {
            backgroundColor: isPending ? '#e3f2fd' : '#0288d1',
            color: isPending ? '#0288d1' : 'white'
          }
        }
      }}
    >
      <Avatar sx={{
        bgcolor: '#e3f2fd',
        color: '#0288d1',
        mr: 2
      }}>
        <Icon />
      </Avatar>
      <Box flexGrow={1}>
        <Typography fontWeight="medium">
          {item.name || item.studyType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.date}
        </Typography>
      </Box>
      <Chip
        label={type === 'lab' ? item.result : item.status}
        icon={isPending ? <AccessTimeIcon /> : null}
        size="small"
        sx={{
          backgroundColor: isPending ? '#fff3e0' : (item.result === "Normal" || item.status === "Completed")
            ? '#e8f5e9'
            : '#ffebee',
          color: isPending ? '#f57c00' : (item.result === "Normal" || item.status === "Completed")
            ? '#2e7d32'
            : '#c62828'
        }}
      />
    </Box>
  );
};

ExamItem.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['lab', 'imaging']).isRequired,
  onClick: PropTypes.func.isRequired
};

const ExamDetailModal = ({ open, onClose, exam, type }) => {
  if (!exam) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: '#f5f9fc'
        }
      }}
    >
      <Box sx={{ p: 3, background: '#0288d1', color: 'white' }}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{
            bgcolor: 'white',
            color: '#0288d1',
            mr: 2
          }}>
            {type === 'lab' ? <ScienceIcon /> : <MedicalServicesIcon />}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {type === 'lab' ? exam.name : exam.studyType}
            </Typography>
            <Typography variant="body2">
              {exam.date}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#0288d1" gutterBottom>
                {type === 'lab' ? 'Laboratory Information' : 'Imaging Center Information'}
              </Typography>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  {type === 'lab' ? 'Laboratory Name' : 'Center Name'}
                </Typography>
                <Typography>
                  {type === 'lab' ? exam.lab || 'Not specified' : exam.imagingCenter || 'Not specified'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Requesting Physician
                </Typography>
                <Typography>
                  {exam.requestingPhysician || 'Not specified'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date Performed
                </Typography>
                <Typography>
                  {exam.datePerformed || exam.date || 'Not specified'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#0288d1" gutterBottom>
                {type === 'lab' ? 'Test Results' : 'Imaging Findings'}
              </Typography>

              {type === 'lab' ? (
                exam.results ? (
                  <>
                    <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Test</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Reference</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(exam.results).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell>{key}</TableCell>
                              <TableCell>{value.value} {value.unit}</TableCell>
                              <TableCell>{value.referenceRange}</TableCell>
                              <TableCell>
                                <Chip
                                  label={value.status || 'Normal'}
                                  size="small"
                                  sx={{
                                    backgroundColor: value.status === 'Normal'
                                      ? '#e8f5e9'
                                      : '#ffebee',
                                    color: value.status === 'Normal'
                                      ? '#2e7d32'
                                      : '#c62828'
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                    {exam.notes && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body2">{exam.notes}</Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography variant="body2">No detailed results available</Typography>
                )
              ) : (
                exam.findings ? (
                  <>
                    <Typography variant="body2" paragraph>
                      {exam.findings}
                    </Typography>
                    {exam.impression && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Radiologist Impression
                        </Typography>
                        <Typography variant="body2">{exam.impression}</Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography variant="body2">No findings available</Typography>
                )
              )}
            </Paper>
          </Grid>
        </Grid>

        {(exam.images || exam.reportUrl) && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight="bold" color="#0288d1" gutterBottom>
              {type === 'lab' ? 'Report' : 'Images'}
            </Typography>
            <Grid container spacing={2}>
              {exam.reportUrl && (
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <DescriptionIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2" gutterBottom>
                      Full Report
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PictureAsPdfIcon />}
                      href={exam.reportUrl}
                      target="_blank"
                      sx={{ mt: 1 }}
                    >
                      View PDF
                    </Button>
                  </Paper>
                </Grid>
              )}
              {exam.images && exam.images.map((img, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <ImageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2" gutterBottom>
                      Image {index + 1}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={() => window.open(img.url, '_blank')}
                      sx={{ mt: 1 }}
                    >
                      View Image
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, background: '#f5f9fc' }}>
        <Button
          onClick={onClose}
          sx={{ color: '#0288d1' }}
        >
          Close
        </Button>
        {(exam.reportUrl || exam.images) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Print Report
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ExamDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  exam: PropTypes.object,
  type: PropTypes.oneOf(['lab', 'imaging']).isRequired
};

const ConsultationCard = ({ consultation }) => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examType, setExamType] = useState(null);

  const handleExamClick = (exam, type) => {
    if (exam.result !== "Pending" && exam.status !== "Pending") {
      setSelectedExam(exam);
      setExamType(type);
      setExamModalOpen(true);
    }
  };

  // Transform simple test strings to objects with "Pending" status
  const labTests = consultation.tests.map(test =>
    typeof test === 'string' ? {
      name: test,
      date: consultation.date,
      result: 'Pending',
      lab: 'Lab',
      reportUrl: '#'
    } : test
  );

  const imagingStudies = consultation.images.map(image =>
    typeof image === 'string' ? {
      studyType: image,
      date: consultation.date,
      status: 'Pending',
      imagingCenter: 'Imaging Center',
      reportUrl: '#'
    } : image
  );

  return (
    <Card sx={{
      mb: 4,
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      background: "#ffffff"
    }}>
      <Box
        p={3}
        bgcolor="#0077b6"
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
              icon={<DescriptionIcon color="primary" />}
              title="Reason for Visit"
              color="primary"
            >
              <Typography variant="body1" color="dark">
                {consultation.reason}
              </Typography>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard
              icon={<DiagnosesIcon color="primary" />}
              title="Diagnosis"
              color="primary"
            >
              <Typography variant="body1" color="dark">
                {consultation.diagnosis}
              </Typography>
            </StyledCard>
          </Grid>

          {consultation.treatments.length > 0 && (
            <Grid item xs={12}>
              <StyledCard
                icon={<MedicalServicesIcon color="primary" />}
                title="Prescribed Treatments"
                color="primary"
              >
                {consultation.treatments.map((treatment, index) => (
                  <TreatmentItem key={index} treatment={treatment} />
                ))}
              </StyledCard>
            </Grid>
          )}

          {(consultation.tests.length > 0 || consultation.images.length > 0) && (
            <Grid item xs={12}>
              <StyledCard
                icon={<ScienceIcon color="primary" />}
                title="Requested Exams"
                color="primary"
              >
                {labTests.length > 0 && (
                  <>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{
                        color: '#0288d1',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ScienceIcon sx={{ mr: 1, color: '#0288d1' }} />
                      LABORATORY TESTS
                    </Typography>
                    {labTests.map((test, index) => (
                      <ExamItem
                        key={`test-${index}`}
                        item={test}
                        type="lab"
                        onClick={() => handleExamClick(test, 'lab')}
                      />
                    ))}
                    <Divider sx={{ my: 2 }} />
                  </>
                )}

                {imagingStudies.length > 0 && (
                  <>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{
                        color: '#0288d1',
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <MedicalServicesIcon sx={{ mr: 1, color: '#0288d1' }} />
                      MEDICAL RADIOLOGY CENTER RESULTS
                    </Typography>
                    {imagingStudies.map((study, index) => (
                      <ExamItem
                        key={`study-${index}`}
                        item={study}
                        type="imaging"
                        onClick={() => handleExamClick(study, 'imaging')}
                      />
                    ))}
                  </>
                )}
              </StyledCard>
            </Grid>
          )}

          {consultation.notes && (
            <Grid item xs={12}>
              <StyledCard
                icon={<NotesIcon color="primary" />}
                title="Notes"
                color="primary"
              >
                <Typography variant="body1" color="dark">
                  {consultation.notes}
                </Typography>
              </StyledCard>
            </Grid>
          )}
        </Grid>
      </Box>

      <ExamDetailModal
        open={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        exam={selectedExam}
        type={examType}
      />
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
    tests: PropTypes.array.isRequired,
    images: PropTypes.array.isRequired,
    notes: PropTypes.string
  }).isRequired
};

const PatientConsultations = () => {
  const user = JSON.parse(localStorage.getItem("connectedUser"));
  const [showModal, setShowModal] = useState(false);
  const [dmeRecords, setDmeRecords] = useState([]);
  const [doctors, setDoctors] = useState({});
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
  const [currentPage, setCurrentPage] = useState(1);
  const consultationsPerPage = 1;

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
        dateConsultation: dateConsultation,
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
            tests: Array.isArray(dme.laboTest) ? dme.laboTest : [],
            images: Array.isArray(dme.imgTest) ? dme.imgTest : [],
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
          <CircularProgress size={60} />
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

  // Préparer les données des consultations
  const consultationsToDisplay = dmeRecords
    .sort((a, b) => new Date(b.dateConsultation) - new Date(a.dateConsultation))
    .map(dme => {
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
        tests: Array.isArray(dme.laboTest) ? dme.laboTest : [],
        images: Array.isArray(dme.imgTest) ? dme.imgTest : [],
        notes: dme.notes || ''
      };
    });

  const totalPages = consultationsToDisplay.length;
  const currentConsultation = consultationsToDisplay[currentPage - 1];

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
          padding: { xs: 2, md: 4 },
          color: "#1a2a3a",
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
              background: "rgba(255, 255, 255, 0.9)",
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
                <Typography variant="h6" color="text.secondary">
                  Medical History
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="dark">
                  {user?.role !== "patient" ? "Patient's Consultations" : "My Consultations"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Afficher les statistiques seulement sur la première page */}
          {currentPage === 1 && (
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <TrendsCard data={consultationTrends} />
              </Grid>
              <Grid item xs={12} md={6}>
                <StatsCard stats={statsData} />
              </Grid>
            </Grid>
          )}

          <Box mb={4}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              color="dark"
            >
              <EventIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Consultation Details
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {user?.role === "patient"
                ? "Detailed information about your consultation."
                : "Detailed information about the patient's consultation."}
            </Typography>
            {user?.role !== "patient" && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="10vh" // Use full viewport height to center vertically
              >
                <SoftButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={handleOpenModal}
                >
                  Add Consultation
                </SoftButton>
              </Box>
            )}
          </Box>

          <Box>
            {currentConsultation ? (
              <ConsultationCard
                key={currentConsultation.id}
                consultation={currentConsultation}
              />
            ) : (
              <SoftTypography variant="body1" color="dark">
                No consultation records found for this patient.
              </SoftTypography>
            )}
          </Box>

          {totalPages > 1 && (
            <SoftBox 
              display="flex" 
              justifyContent="center" 
              mt={4}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#1976d2',
                  '&.Mui-selected': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  }
                }
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </SoftBox>
          )}
        </Box>
      </Box>

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="consultation-modal-title"
      >
        <Box sx={modalStyle}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <SoftTypography
              id="consultation-modal-title"
              variant="h5"
              fontWeight="bold"
              color="dark"
            >
              <MedicalServicesIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
              New Medical Consultation
            </SoftTypography>

            <SoftBox
              sx={{
                background: 'rgba(0, 0, 0, 0.05)',
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
                    <SoftTypography variant="caption" display="block" color="text.secondary">
                      Doctor: {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : 'Unknown'}
                    </SoftTypography>
                    <SoftTypography variant="caption" display="block" color="text.secondary">
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
              <TextField
                fullWidth
                type="date"
                name="dateConsultation"
                label="Date"
                required
                value={formData.dateConsultation}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                name="reason"
                label="Reason of Visit"
                multiline
                rows={6}
                value={formData.reason}
                onChange={handleInputChange}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                name="diagnosis"
                label="Diagnosis (comma separated)"
                multiline
                rows={5}
                required
                value={formData.diagnosis}
                onChange={handleInputChange}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                name="treatments"
                label="Prescribed Treatments (one per line)"
                multiline
                rows={4}
                value={formData.treatments}
                onChange={handleInputChange}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                name="laboTest"
                label="Lab Tests (comma separated)"
                value={formData.laboTest}
                onChange={handleInputChange}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                name="imgTest"
                label="Imaging Tests (comma separated)"
                value={formData.imgTest}
                onChange={handleInputChange}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                name="notes"
                label="Doctor Notes"
                multiline
                rows={6}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Box>

            <SoftBox mt={4} display="flex" justifyContent="flex-end">
  <SoftButton
    color="secondary"
    variant="outlined"
    onClick={handleCloseModal}
    sx={{ mr: 2 }}
    disabled={submitStatus === "submitting"}
  >
    Cancel
  </SoftButton>
            <SoftButton
              color="#0077b6"
              type="submit"
              disabled={submitStatus === "submitting"}
              sx={{
                backgroundColor: "#0077b6",
                color: "#ffffff", // White text for contrast
                "&:hover": {
                  backgroundColor: "#005f8c", // Slightly darker shade for hover effect
                },
                "&:disabled": {
                  backgroundColor: "#b0c4de", // Light blue-gray for disabled state
                  color: "#ffffff",
                },
              }}
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