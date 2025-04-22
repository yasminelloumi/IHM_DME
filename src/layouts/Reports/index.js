import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import {
  Card,
  Button,
  CircularProgress,
  Box,
  Avatar,
  Stack,
  Modal,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Event as EventIcon,
  InsertDriveFile as FileIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";

// Mock data - replace with your real data
const mockReports = [
  {
    id: "1",
    patientId: "PAT-00123",
    fileName: "Annual Medical Report",
    description: "Complete health checkup with blood analysis",
    timestamp: "2023-05-15T10:30:00Z",
    fileUrl: "#",
  },
  {
    id: "2",
    patientId: "PAT-00123",
    fileName: "Chest X-ray Report",
    description: "Radiological examination of lungs - normal results",
    timestamp: "2023-03-22T14:15:00Z",
    fileUrl: "#",
  },
  {
    id: "3",
    patientId: "PAT-00123",
    fileName: "Blood Test Results",
    description: "Complete blood count analysis",
    timestamp: "2023-01-10T09:45:00Z",
    fileUrl: "#",
  },
];

// Style constants
const cardStyle = {
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  background: "#ffffff",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  },
};

const headerStyle = {
  p: 2,
  bgcolor: "#1976d2",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  borderRadius: "12px 12px 0 0",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", md: "600px" },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "12px",
  p: 4,
  outline: "none",
};

const ReportCard = ({ report, onViewClick }) => (
  <Card sx={{ ...cardStyle, minHeight: "250px" }}>
    <Box sx={headerStyle}>
      <Box display="flex" alignItems="center">
        <DescriptionIcon sx={{ mr: 1, color: "white" }} />
        <SoftTypography variant="h6" fontWeight="bold" color="white">
          {report.fileName}
        </SoftTypography>
      </Box>
      <SoftTypography variant="body2" color="white">
        {new Date(report.timestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </SoftTypography>
    </Box>

    <SoftBox p={2}>
      <Card
        sx={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          mb: 2,
          borderLeft: "4px solid",
          borderLeftColor: "primary.main",
        }}
      >
        <SoftBox p={2}>
          <SoftBox display="flex" alignItems="center" mb={2}>
            <DescriptionIcon
              sx={{
                color: "primary.main",
                mr: 2,
                width: 24,
                height: 24,
              }}
            />
            <SoftTypography variant="h6" fontWeight="bold" color="dark">
              Document Info
            </SoftTypography>
          </SoftBox>

          <SoftTypography
            variant="body2"
            color="dark"
            mb={2}
            sx={{ minHeight: "40px" }}
          >
            {report.description || "No description available."}
          </SoftTypography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<DescriptionIcon />}
            onClick={() => onViewClick(report)}
            sx={{ borderRadius: "8px" }}
          >
            View Report
          </Button>
        </SoftBox>
      </Card>
    </SoftBox>
  </Card>
);

ReportCard.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.string.isRequired,
    patientId: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    description: PropTypes.string,
    timestamp: PropTypes.string.isRequired,
    fileUrl: PropTypes.string,
  }).isRequired,
  onViewClick: PropTypes.func.isRequired,
};

const ReportModal = ({ report, open, onClose }) => {
  if (!report) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="report-modal-title"
      aria-describedby="report-modal-description"
    >
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <SoftTypography id="report-modal-title" variant="h4" fontWeight="bold">
            Document Info
          </SoftTypography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Box display="flex" alignItems="center">
            <PersonIcon color="primary" sx={{ mr: 2 }} />
            <Box>
              <SoftTypography variant="caption" color="textSecondary">
                Patient ID
              </SoftTypography>
              <SoftTypography variant="body1">{report.patientId}</SoftTypography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <FileIcon color="primary" sx={{ mr: 2 }} />
            <Box>
              <SoftTypography variant="caption" color="textSecondary">
                Report Name
              </SoftTypography>
              <SoftTypography variant="body1">{report.fileName}</SoftTypography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <EventIcon color="primary" sx={{ mr: 2 }} />
            <Box>
              <SoftTypography variant="caption" color="textSecondary">
                Date Generated
              </SoftTypography>
              <SoftTypography variant="body1">
                {new Date(report.timestamp).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </SoftTypography>
            </Box>
          </Box>

          <Box display="flex" alignItems="flex-start">
            <NotesIcon color="primary" sx={{ mr: 2, mt: 1 }} />
            <Box>
              <SoftTypography variant="caption" color="textSecondary">
                Description
              </SoftTypography>
              <SoftTypography variant="body1">
                {report.description || "No description provided."}
              </SoftTypography>
            </Box>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DescriptionIcon />}
            href={report.fileUrl || `#${report.fileName}`}
            target="_blank"
            sx={{ mr: 2 }}
          >
            Open Full Report
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

ReportModal.propTypes = {
  report: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setReports(mockReports);
      } catch (err) {
        console.error("Error loading reports:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

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
          <SoftTypography variant="h5" color="error">
            {error}
          </SoftTypography>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
          padding: { xs: 2, md: 3 },
        }}
      >
        <SoftBox px={2}>
          {/* Page header */}
          <Box
            display="flex"
            alignItems="center"
            mb={3}
            p={2}
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#1565c0",
                color: "#ffffff",
                border: "2px solid white",
                width: 40,
                height: 40,
                mr: 2,
              }}
            >
              <DescriptionIcon fontSize="medium" />
            </Avatar>
            <Box>
              <SoftTypography variant="h6" color="textSecondary">
                Medical Records
              </SoftTypography>
              <SoftTypography variant="h4" fontWeight="bold" color="dark">
                Reports
              </SoftTypography>
            </Box>
          </Box>

          {/* Content section */}
          <SoftBox mb={3}>
            <SoftTypography variant="h5" fontWeight="bold" gutterBottom color="dark">
              <DescriptionIcon color="primary" sx={{ verticalAlign: "middle", mr: 1 }} />
              Report History
            </SoftTypography>
            <SoftTypography variant="body2" color="textSecondary" paragraph>
              View and manage your medical reports and documents.
            </SoftTypography>
          </SoftBox>

          {/* Reports list */}
          <Box>
            {reports.length > 0 ? (
              <Grid container spacing={2}>
                {reports.map((report) => (
                  <Grid item xs={12} sm={6} key={report.id}>
                    <ReportCard report={report} onViewClick={handleViewReport} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 3, textAlign: "center", ...cardStyle }}>
                <SoftTypography variant="body1" color="text">
                  No reports found for this patient.
                </SoftTypography>
              </Card>
            )}
          </Box>
        </SoftBox>
      </SoftBox>
      <Footer />

      {/* Report Modal */}
      <ReportModal report={selectedReport} open={modalOpen} onClose={handleCloseModal} />
    </DashboardLayout>
  );
};

export default Reports;