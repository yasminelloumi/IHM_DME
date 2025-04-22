import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import {
  Card,
  Divider,
  CircularProgress,
  Box,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  MedicalServices as RadiologyIcon,
  Biotech as LabIcon,
  Person as PersonIcon,
  CalendarToday as DateIcon,
  Description as DescriptionIcon,
  Assignment as ReportIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { getImages } from "services/imagesService";
import { getReportsByPatient } from "services/reportsServices";

// Reusable Popup Component
const PopupModal = ({ open, onClose, children, title }) => {
  if (!open) return null;

  return (
    <SoftBox
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          width: "95%",
          height: "95%",
          maxWidth: "1400px",
          maxHeight: "95vh",
          position: "relative",
          backgroundColor: title ? "white" : "transparent",
          borderRadius: "8px",
          padding: title ? 3 : 0,
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <SoftTypography variant="h5" color="primary">
              {title}
            </SoftTypography>
            <IconButton onClick={onClose} size="large">
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>
        )}

        {!title && (
          <IconButton
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "12px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
            onClick={onClose}
            size="large"
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>{children}</Box>
      </Box>
    </SoftBox>
  );
};

const Reports = () => {
  const [radiologyData, setRadiologyData] = useState([]);
  const [labData, setLabData] = useState([]);
  const [filteredRadiologyData, setFilteredRadiologyData] = useState([]);
  const [filteredLabData, setFilteredLabData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // State for popup management
  const [imagePopup, setImagePopup] = useState({
    open: false,
    url: null,
    title: null,
  });

  const [pdfPopup, setPdfPopup] = useState({
    open: false,
    url: null,
    title: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get the connected user and scanned patient from local storage
        const connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
        const scannedPatient = JSON.parse(localStorage.getItem("scannedPatient"));

        if (!connectedUser || !connectedUser.id) {
          throw new Error("User ID not found in local storage");
        }

        // Determine the patientId based on the user's role
        let patientId;
        if (connectedUser.role === "patient") {
          patientId = connectedUser.id; // Patient sees their own reports
        } else {
          // For non-patient roles (e.g., doctor), use scannedPatient.id
          if (!scannedPatient || !scannedPatient.id) {
            throw new Error("No scanned patient found in local storage");
          }
          patientId = scannedPatient.id;
        }

        // Fetch images and reports
        const [fetchedImages, fetchedReports] = await Promise.all([
          getImages(patientId),
          getReportsByPatient(patientId),
        ]);

        setRadiologyData(fetchedImages);
        setLabData(fetchedReports);
        setFilteredRadiologyData(fetchedImages);
        setFilteredLabData(fetchedReports);
      } catch (error) {
        console.error("Loading error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search and sort
  useEffect(() => {
    let filteredImages = [...radiologyData];
    let filteredReports = [...labData];

    // Apply search filter
    if (searchQuery) {
      filteredImages = filteredImages.filter(
        (image) =>
          image.imgTest.toLowerCase().includes(searchQuery.toLowerCase()) ||
          new Date(image.dateCreation)
            .toLocaleDateString()
            .includes(searchQuery.toLowerCase())
      );
      filteredReports = filteredReports.filter(
        (report) =>
          report.labTest.toLowerCase().includes(searchQuery.toLowerCase()) ||
          new Date(report.timestamp)
            .toLocaleDateString()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply sort
    const sortFunction = (a, b) => {
      const dateA = new Date(a.dateCreation || a.timestamp);
      const dateB = new Date(b.dateCreation || b.timestamp);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    };

    filteredImages.sort(sortFunction);
    filteredReports.sort(sortFunction);

    setFilteredRadiologyData(filteredImages);
    setFilteredLabData(filteredReports);
  }, [searchQuery, sortOrder, radiologyData, labData]);

  const handleViewImage = (imageUrl, title) => {
    const fullUrl = `http://localhost:3002${imageUrl}`;
    setImagePopup({
      open: true,
      url: fullUrl,
      title: title,
    });
  };

  const handleCloseImage = () => {
    setImagePopup({
      open: false,
      url: null,
      title: null,
    });
  };

  const handleViewPdf = (pdfUrl, title) => {
    setPdfPopup({
      open: true,
      url: pdfUrl,
      title: title,
    });
  };

  const handleClosePdf = () => {
    setPdfPopup({
      open: false,
      url: null,
      title: null,
    });
  };

  const handleDeleteImage = async (id) => {
    try {
      await deleteImage(id);
      setRadiologyData(radiologyData.filter((image) => image.id !== id));
      setFilteredRadiologyData(filteredRadiologyData.filter((image) => image.id !== id));
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress size={60} color="primary" />
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox p={3} display="flex" justifyContent="center">
          <Card sx={{ maxWidth: "600px", width: "100%", p: 3 }}>
            <SoftTypography variant="h5" color="error" textAlign="center">
              Error Loading Data
            </SoftTypography>
            <SoftTypography variant="body2" textAlign="center" mt={2}>
              {error}
            </SoftTypography>
          </Card>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={2}>
        {/* Search and Sort Controls */}
        <SoftBox display="flex" gap={2} mb={3} sx={{ flexWrap: "wrap" }}>
          <TextField
            label="Search by Test Name or Date"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, minWidth: "200px" }}
          />
          <FormControl sx={{ minWidth: "150px" }}>
            <InputLabel>Sort By Date</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Sort By Date"
            >
              <MenuItem value="desc">Newest First</MenuItem>
              <MenuItem value="asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </SoftBox>

        {/* Side-by-Side Sections */}
        <SoftBox
          display="flex"
          gap={2}
          sx={{
            flexDirection: { xs: "column", md: "row" }, // Stack on small screens, side-by-side on medium+
            alignItems: "flex-start",
            "& > *": {
              flex: 1,
              minWidth: 0, // Prevent overflow
            },
          }}
        >
          {/* Radiology Section */}
          <Card sx={{ borderRadius: "12px", height: "100%" }}>
            <SoftBox
              sx={{
                p: 2,
                bgcolor: "#1976d2",
                color: "white",
                display: "flex",
                alignItems: "center",
                borderRadius: "12px 12px 0 0",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <RadiologyIcon sx={{ mr: 2, color: "white" }} />
              <SoftTypography variant="h6" color="white">
                Medical Radiology Center
              </SoftTypography>
            </SoftBox>

            <SoftBox
              p={2}
              sx={{
                maxHeight: "240px", // Larger height for 3 accordion items (~80px each)
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              {filteredRadiologyData.length === 0 ? (
                <SoftBox p={3} textAlign="center">
                  <SoftTypography variant="body1">
                    No radiology images found.
                  </SoftTypography>
                </SoftBox>
              ) : (
                filteredRadiologyData.map((image) => (
                  <Accordion
                    key={image.id}
                    sx={{
                      mb: 1,
                      borderRadius: "8px",
                      "& .MuiAccordionSummary-root": {
                        minHeight: "72px", // Larger height for collapsed state
                        padding: "0 16px", // Increased padding
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <ReportIcon color="primary" />
                        <SoftTypography variant="h6" color="primary" fontSize="1.1rem">
                          {image.imgTest}
                        </SoftTypography>
                        <SoftTypography
                          variant="body2"
                          color="text.secondary"
                          fontSize="0.9rem"
                        >
                          ({new Date(image.dateCreation).toLocaleDateString()})
                        </SoftTypography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" alignItems="center">
                          <PersonIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />
                          <SoftTypography variant="body2">
                            <strong>Patient ID:</strong> {image.patientId}
                          </SoftTypography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <DateIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />
                          <SoftTypography variant="body2">
                            <strong>Date:</strong>{" "}
                            {new Date(image.dateCreation).toLocaleDateString()}
                          </SoftTypography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex">
                          <DescriptionIcon
                            fontSize="small"
                            sx={{ mr: 1, mt: 0.5, color: "action.active" }}
                          />
                          <Box>
                            <SoftTypography variant="body2" fontWeight="bold">
                              Findings:
                            </SoftTypography>
                            <SoftTypography variant="body2">
                              {image.description}
                            </SoftTypography>
                          </Box>
                        </Box>
                        <SoftBox display="flex" justifyContent="flex-end" mt={2} gap={2}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<ImageIcon />}
                            onClick={() => handleViewImage(image.url, image.imgTest)}
                          >
                            View Image
                          </Button>
                        </SoftBox>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </SoftBox>
          </Card>

          {/* Laboratory Section */}
          <Card sx={{ borderRadius: "12px", height: "100%" }}>
            <SoftBox
              sx={{
                p: 2,
                bgcolor: "#1976d2",
                color: "white",
                display: "flex",
                alignItems: "center",
                borderRadius: "12px 12px 0 0",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <LabIcon sx={{ mr: 2, color: "white" }} />
              <SoftTypography variant="h6" color="white">
                Laboratory Results
              </SoftTypography>
            </SoftBox>

            <SoftBox
              p={2}
              sx={{
                maxHeight: "240px", // Larger height for 3 accordion items (~80px each)
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              {filteredLabData.length === 0 ? (
                <SoftBox p={3} textAlign="center">
                  <SoftTypography variant="body1">
                    No laboratory reports found.
                  </SoftTypography>
                </SoftBox>
              ) : (
                filteredLabData.map((report) => (
                  <Accordion
                    key={report.id}
                    sx={{
                      mb: 1,
                      borderRadius: "8px",
                      "& .MuiAccordionSummary-root": {
                        minHeight: "72px", // Larger height for collapsed state
                        padding: "0 16px", // Increased padding
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <ReportIcon color="primary" />
                        <SoftTypography variant="h6" color="primary" fontSize="1.1rem">
                          {report.labTest}
                        </SoftTypography>
                        <SoftTypography
                          variant="body2"
                          color="text.secondary"
                          fontSize="0.9rem"
                        >
                          ({new Date(report.timestamp).toLocaleDateString()})
                        </SoftTypography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" alignItems="center">
                          <PersonIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />
                          <SoftTypography variant="body2">
                            <strong>Patient ID:</strong> {report.patientId}
                          </SoftTypography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <DateIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />
                          <SoftTypography variant="body2">
                            <strong>Date:</strong>{" "}
                            {new Date(report.timestamp).toLocaleDateString()}
                          </SoftTypography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex">
                          <DescriptionIcon
                            fontSize="small"
                            sx={{ mr: 1, mt: 0.5, color: "action.active" }}
                          />
                          <Box>
                            <SoftTypography variant="body2" fontWeight="bold">
                              Results:
                            </SoftTypography>
                            <SoftTypography variant="body2">
                              {report.description}
                            </SoftTypography>
                          </Box>
                        </Box>
                        {report.filePath && (
                          <SoftBox display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<PdfIcon />}
                              onClick={() => handleViewPdf(report.filePath, report.labTest)}
                            >
                              View PDF Report
                            </Button>
                          </SoftBox>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      {/* Image Popup Modal */}
      <PopupModal open={imagePopup.open} onClose={handleCloseImage}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={imagePopup.url}
            alt="Medical Imaging"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </PopupModal>

      {/* PDF Popup Modal */}
      <PopupModal
        open={pdfPopup.open}
        onClose={handleClosePdf}
        title={pdfPopup.title ? `${pdfPopup.title} Report` : "PDF Report"}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <iframe
            src={pdfPopup.url}
            title="PDF Report"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </Box>
      </PopupModal>

      <Footer />
    </DashboardLayout>
  );
};

export default Reports;