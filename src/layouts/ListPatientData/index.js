import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QrCodeScanner as QrCodeScannerIcon, MedicalServices as MedicalServicesIcon, Close as CloseIcon, Upload as UploadIcon } from "@mui/icons-material";
import { Box, IconButton, Snackbar, Alert, CircularProgress, Tooltip } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";

import QRCodeScanner from "layouts/TablePatient/data/QRCodeScanner";

// Placeholder image for QR code scanning scenario (replace with an actual image path or URL)
const qrCodeScanImage = "https://qr.stream.mk/images/share.png"; // Replace with a real image URL or local asset (e.g., hands scanning a QR code)

// Stethoscope illustration (replace with an actual image path or URL)
const stethoscopeImage = "https://png.pngtree.com/png-clipart/20230325/ourmid/pngtree-stethoscope-blue-png-image_6663960.png"; // Replace with a real stethoscope image URL or local asset

// Define styles for the ListDatas page
const listDatasStyles = {
  dashboardLayout: {
    background: "linear-gradient(135deg, #f5f9ff 0%, #e0f2ff 100%)",
    position: "relative",
    minHeight: "100vh",
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "radial-gradient(circle, rgba(0, 119, 182, 0.1) 0%, transparent 70%)",
      opacity: 0.05,
      zIndex: 0,
    },
  },
  header: {
    py: 4, // Increased padding for better spacing
    px: 3,
    background: "rgba(255, 255, 255, 0.9)", // Lighter background to differentiate from button
    color: "#005f8d", // Use the primary color for text to maintain consistency
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)", // Softer shadow
    borderRadius: "12px",
    mb: 5, // Increased margin-bottom for better separation
    width: "100%", // Full width
    maxWidth: "none", // Remove max-width constraint
    animation: "fadeIn 0.5s ease-in-out",
  },
  scannerButton: {
    padding: "18px 36px", // Slightly larger for prominence
    fontSize: "1.3rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #0077b6 0%, #005f8d 100%)", // Gradient for more depth
    color: "#fff",
    borderRadius: "16px",
    boxShadow: "0 6px 16px rgba(0, 119, 182, 0.3)",
    "&:hover": {
      background: "linear-gradient(135deg, #005f8d 0%, #004a6e 100%)",
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(0, 119, 182, 0.4)",
    },
    "&:focus": {
      outline: "3px solid #0077b6",
      outlineOffset: "2px",
    },
    "&:active": {
      transform: "translateY(1px)",
    },
    transition: "all 0.3s ease",
  },
  placeholderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "600px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    padding: "2.5rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    position: "relative",
    animation: "fadeIn 0.5s ease-in-out",
  },
  qrCodeScanImage: {
    width: "100%",
    maxWidth: "350px", // Slightly smaller for better balance
    borderRadius: "12px",
    mb: 2,
    border: "1px solid rgba(0, 119, 182, 0.1)",
  },
  placeholderText: {
    textAlign: "center",
    mt: 2,
    color: "#666",
    fontSize: "1.1rem",
    fontWeight: 500,
  },
  stethoscopeIllustration: {
    position: "absolute",
    top: "-40px", // Moved to the top to avoid overlapping content
    right: "-40px",
    width: "80px", // Smaller size
    height: "80px",
    background: `url(${stethoscopeImage}) no-repeat center`,
    backgroundSize: "contain",
    opacity: 0.5, // Reduced opacity to make it less intrusive
    zIndex: 1,
  },
  scannerContainer: {
    position: "relative",
    maxWidth: "550px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(0, 119, 182, 0.2)",
    border: "1px solid rgba(0, 119, 182, 0.2)",
    overflow: "hidden",
    animation: "slideIn 0.5s ease-in-out",
  },
  scannerHeader: {
    padding: "1.5rem",
    background: "linear-gradient(135deg, #e6f0ff 0%, #f5f9ff 100%)",
    borderBottom: "1px solid rgba(0, 119, 182, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scannerArea: {
    padding: "2rem",
    position: "relative",
    "& #reader": {
      width: "100% !important",
      height: "auto !important",
      borderRadius: "12px",
      border: "3px dashed #005f8d",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 0 10px rgba(0, 119, 182, 0.1)",
    },
  },
  scanningOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    "&:before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "3px",
      backgroundColor: "#005f8d",
      boxShadow: "0 0 15px rgba(0, 119, 182, 0.6)",
      animation: "scanLine 1.5s infinite linear",
    },
  },
  instructions: {
    padding: "1.5rem 2rem",
    textAlign: "center",
    backgroundColor: "rgba(240, 245, 255, 0.5)",
    borderTop: "1px solid rgba(0, 119, 182, 0.1)",
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: 600,
    backgroundColor: "#f5f9ff",
    color: "#005f8d",
    borderRadius: "10px",
    border: "1px solid #005f8d",
    mt: 2,
    "&:hover": {
      backgroundColor: "#e6f0ff",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 8px rgba(0, 119, 182, 0.2)",
    },
    "&:focus": {
      outline: "2px solid #005f8d",
    },
    transition: "all 0.3s ease",
  },
};

// Define keyframes for animations
const keyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes scanLine {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

// Inject keyframes into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

function ListDatas() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleScanSuccess = async (CIN) => {
    setScannerOpen(false);
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/patients?CIN=${CIN}`);
      if (response.data && response.data.length > 0) {
        const scannedPatient = response.data[0];
        localStorage.setItem("scannedPatient", JSON.stringify(scannedPatient));

        setSnackbarMessage(`Patient ${scannedPatient.nom} ${scannedPatient.prenom} loaded!`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        const connectedUser = JSON.parse(localStorage.getItem("connectedUser"));

        if (connectedUser?.role === "centreImagerie") {
          navigate("/imaging");
        } else if (connectedUser?.role === "laboratoire") {
          navigate("/laboratory");
        } else {
          setSnackbarMessage("Unrecognized role. Cannot navigate.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage("Patient not found.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setSnackbarMessage("Error fetching patient data. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanError = (err) => {
    console.error("QR Scan Error:", err);
    setSnackbarMessage("Error scanning QR code. Please try again.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("reader");
    try {
      const result = await html5QrCode.scanFile(file, true);
      handleScanSuccess(result);
    } catch (err) {
      handleScanError(err);
    }
  };

  return (
    <DashboardLayout sx={listDatasStyles.dashboardLayout}>
      <DashboardNavbar />

      {/* Main Content Container */}
      <SoftBox
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="calc(100vh - 120px)" // Ensure content takes up most of the viewport height
        pt={4}
        pb={6}
      >
        {/* Custom Header */}
        <SoftBox sx={listDatasStyles.header}>
          <MedicalServicesIcon sx={{ fontSize: "3rem", mr: 1.5 }} />
          <SoftTypography variant="h4" fontWeight="bold" fontSize="1.5rem">
            Scan Patient QR Code
          </SoftTypography>
        </SoftBox>

        {/* Scanner Button and Container */}
        <SoftBox mt={5} display="flex" flexDirection="column" alignItems="center" gap={4}>
          <Tooltip title="Scan a patient's QR code to access their medical records" placement="top">
            <SoftButton
              onClick={() => setScannerOpen(!scannerOpen)}
              sx={listDatasStyles.scannerButton}
              startIcon={<QrCodeScannerIcon />}
              aria-label={scannerOpen ? "Close QR Code Scanner" : "Open QR Code Scanner"}
            >
              {scannerOpen ? "Close Scanner" : "Scan QR Code"}
            </SoftButton>
          </Tooltip>

          {scannerOpen ? (
            <Box sx={listDatasStyles.scannerContainer}>
              {/* Scanner Header */}
              <Box sx={listDatasStyles.scannerHeader}>
                <SoftTypography variant="h6" fontWeight="medium">
                  QR Code Scanner
                </SoftTypography>
                <IconButton
                  onClick={() => setScannerOpen(false)}
                  sx={{ color: "#666" }}
                  aria-label="Close QR Code Scanner"
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Scanner Area */}
              <Box sx={listDatasStyles.scannerArea}>
                <QRCodeScanner onScanSuccess={handleScanSuccess} onError={handleScanError} />
                <Box sx={listDatasStyles.scanningOverlay} />
              </Box>

              {/* Instructions */}
              <Box sx={listDatasStyles.instructions}>
                <SoftTypography variant="body1" color="text.secondary">
                  Align the patient's QR code within the frame to scan their medical ID, or upload an image.
                </SoftTypography>
                <SoftButton
                  onClick={() => fileInputRef.current.click()}
                  sx={listDatasStyles.uploadButton}
                  startIcon={<UploadIcon />}
                  aria-label="Upload QR Code Image"
                >
                  Upload Image
                </SoftButton>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </Box>
            </Box>
          ) : (
            <Box sx={listDatasStyles.placeholderContainer}>
              {/* QR Code Scanning Image */}
              <img src={qrCodeScanImage} alt="QR Code Scanning Scenario" style={listDatasStyles.qrCodeScanImage} loading="lazy" />

              {/* Stethoscope Illustration */}
              <Box sx={listDatasStyles.stethoscopeIllustration} />

              {/* Placeholder Text */}
              <SoftTypography variant="body1" sx={listDatasStyles.placeholderText}>
                Scan a patient’s QR code to access their medical records securely.
              </SoftTypography>
            </Box>
          )}
        </SoftBox>
      </SoftBox>

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </DashboardLayout>
  );
}

export default ListDatas;