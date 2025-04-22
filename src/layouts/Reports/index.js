import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import {
  Card,
  Divider,
  Chip,
  CircularProgress,
  Box,
  Button,
  IconButton
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
  Visibility as ViewIcon
} from "@mui/icons-material";

const Reports = () => {
  const [radiologyData, setRadiologyData] = useState([]);
  const [labData, setLabData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sample data with image URL
        const mockData = {
          images: [
            {
              id: "1",
              patientId: "4024",
              description: "Chest X-ray showing mild pulmonary congestion",
              dateCreated: "2025-04-22",
              imgTest: "Chest X-ray",
              imageUrl: "https://example.com/path/to/xray.jpg", // Added image URL
              pdfUrl: "https://example.com/path/to/report.pdf" // Added PDF URL
            }
          ],
          reports: [
            {
              id: "1",
              patientId: "4024",
              description: "Complete blood count with normal results",
              timestamp: "2025-04-21",
              labTest: "Complete Blood Count",
              pdfUrl: "https://example.com/path/to/lab-report.pdf" // Added PDF URL
            }
          ]
        };

        setRadiologyData(mockData.images);
        setLabData(mockData.reports);
        
      } catch (error) {
        console.error("Loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handleOpenPdf = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox p={2}>
        {/* Radiology Section */}
        <Card sx={{ mb: 3, borderRadius: "12px" }}>
          <SoftBox sx={{ 
            p: 2,
            bgcolor: "#1976d2",
            color: "white",
            display: "flex",
            alignItems: "center",
            borderRadius: "12px 12px 0 0"
          }}>
            <RadiologyIcon sx={{ mr: 2, color: "white" }} />
            <SoftTypography variant="h6" color="white">
              Medical Radiology Center
            </SoftTypography>
          </SoftBox>
          
          <SoftBox p={2}>
            {radiologyData.map(report => (
              <Box key={report.id} sx={{ 
                p: 2, 
                mb: 2, 
                border: "1px solid #eee", 
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: 1
              }}>
                <Box display="flex" alignItems="center">
                  <ReportIcon color="primary" sx={{ mr: 1 }} />
                  <SoftTypography variant="h6" color="primary">
                    {report.imgTest}
                  </SoftTypography>
                </Box>

                <Box display="flex" alignItems="center">
                  <PersonIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />
                  <SoftTypography variant="body2">
                    <strong>Patient ID:</strong> {report.patientId}
                  </SoftTypography>
                </Box>

                <Box display="flex" alignItems="center">
                  <DateIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />
                  <SoftTypography variant="body2">
                    <strong>Date:</strong> {report.dateCreated}
                  </SoftTypography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box display="flex">
                  <DescriptionIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: "action.active" }} />
                  <Box>
                    <SoftTypography variant="body2" fontWeight="bold">
                      Findings:
                    </SoftTypography>
                    <SoftTypography variant="body2">
                      {report.description}
                    </SoftTypography>
                  </Box>
                </Box>

                {/* Action Buttons for Radiology - Only View Image button remains */}
                {report.imageUrl && (
                  <SoftBox display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<ImageIcon />}
                      onClick={() => handleViewImage(report.imageUrl)}
                    >
                      View Image
                    </Button>
                  </SoftBox>
                )}
              </Box>
            ))}
          </SoftBox>
        </Card>

        {/* Laboratory Section */}
        <Card sx={{ mb: 3, borderRadius: "12px" }}>
          <SoftBox sx={{ 
            p: 2,
            bgcolor: "#1976d2",
            color: "white",
            display: "flex",
            alignItems: "center",
            borderRadius: "12px 12px 0 0"
          }}>
            <LabIcon sx={{ mr: 2, color: "white" }} />
            <SoftTypography variant="h6" color="white">
              Laboratory Results
            </SoftTypography>
          </SoftBox>
          
          <SoftBox p={2}>
            {labData.map(report => (
              <Box key={report.id} sx={{ 
                p: 2, 
                mb: 2, 
                border: "1px solid #eee", 
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: 1
              }}>
                <Box display="flex" alignItems="center">
                  <ReportIcon color="primary" sx={{ mr: 1 }} />
                  <SoftTypography variant="h6" color="primary">
                    {report.labTest}
                  </SoftTypography>
                </Box>

                <Box display="flex" alignItems="center">
                  <PersonIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />
                  <SoftTypography variant="body2">
                    <strong>Patient ID:</strong> {report.patientId}
                  </SoftTypography>
                </Box>

                <Box display="flex" alignItems="center">
                  <DateIcon fontSize="small" sx={{ mr: 1, color: "action.active" }} />
                  <SoftTypography variant="body2">
                    <strong>Date:</strong> {report.timestamp}
                  </SoftTypography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box display="flex">
                  <DescriptionIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: "action.active" }} />
                  <Box>
                    <SoftTypography variant="body2" fontWeight="bold">
                      Results:
                    </SoftTypography>
                    <SoftTypography variant="body2">
                      {report.description}
                    </SoftTypography>
                  </Box>
                </Box>

                {/* Action Button for Lab Reports */}
                {report.pdfUrl && (
                  <SoftBox display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<PdfIcon />}
                      onClick={() => handleOpenPdf(report.pdfUrl)}
                    >
                      View PDF Report
                    </Button>
                  </SoftBox>
                )}
              </Box>
            ))}
          </SoftBox>
        </Card>
      </SoftBox>

      {/* Image Modal */}
      {selectedImage && (
        <SoftBox
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
          onClick={handleCloseImage}
        >
          <Box
            sx={{
              maxWidth: '90%',
              maxHeight: '90%',
              position: 'relative'
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)'
                }
              }}
              onClick={handleCloseImage}
            >
              <ViewIcon />
            </IconButton>
            <img
              src={selectedImage}
              alt="Medical Imaging"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                display: 'block'
              }}
            />
          </Box>
        </SoftBox>
      )}

      <Footer />
    </DashboardLayout>
  );
};

export default Reports;