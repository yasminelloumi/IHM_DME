import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import axios from "axios";
import {
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Modal,
  Fade,
  Divider,
} from "@mui/material";
import {
  Person,
  Phone,
  Cake,
  Public,
  VisibilityOutlined,
  Search,
  Clear,
  Close,
  QrCodeScanner,
  FolderOpen,
  Upload as UploadIcon,
} from "@mui/icons-material";
import QRCodeScanner from "./QRCodeScanner";
import { Html5Qrcode } from "html5-qrcode";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "500px" },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  p: 3,
};

// Custom styles for the QR code scanner
const scannerStyles = {
  scannerButton: {
    padding: "14px 28px",
    fontSize: "1.2rem",
    fontWeight: 600,
    background: "linear-gradient(135deg, #0077b6 0%, #005f8d 100%)",
    color: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 119, 182, 0.3)",
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #005f8d 0%, #004a6e 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(0, 119, 182, 0.4)",
    },
    "&:focus": {
      outline: "3px solid #0077b6",
      outlineOffset: "2px",
    },
    "&:active": {
      transform: "scale(0.95)",
      transition: "transform 0.1s ease",
    },
    transition: "all 0.3s ease",
  },
  scannerContainer: {
    position: "relative",
    maxWidth: "450px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(0, 119, 182, 0.2)",
    border: "1px solid rgba(0, 119, 182, 0.2)",
    overflow: "hidden",
    animation: "slideIn 0.5s ease-in-out",
    mx: "auto",
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
      border: "3px dashed #0077b6",
      position: "relative",
      overflow: "hidden",
      animation: "glowBorder 2s infinite ease-in-out",
      backgroundColor: "#f5f9ff",
      boxShadow: "inset 0 0 10px rgba(0, 119, 182, 0.1)",
    },
    "& #reader video": {
      borderRadius: "12px",
    },
    "& #reader__dashboard": {
      padding: "1rem",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderTop: "1px solid rgba(0, 119, 182, 0.1)",
    },
    "& #reader__scan_region": {
      padding: "0 !important",
    },
    "& #reader__dashboard_section_csr button, & #reader__dashboard_section_fsr button": {
      position: "relative",
      padding: "14px 28px",
      fontSize: "1.2rem",
      fontWeight: 600,
      background: "linear-gradient(135deg, #0077b6 0%, #005f8d 100%)",
      color: "#fff",
      borderRadius: "12px",
      border: "none",
      boxShadow: "0 4px 12px rgba(0, 119, 182, 0.3)",
      textTransform: "none",
      "&:hover": {
        background: "linear-gradient(135deg, #005f8d 0%, #004a6e 100%)",
        transform: "translateY(-2px)",
        boxShadow: "0 6px 16px rgba(0, 119, 182, 0.4)",
      },
      "&:focus": {
        outline: "3px solid #0077b6",
        outlineOffset: "2px",
      },
      "&:active": {
        transform: "scale(0.95)",
        transition: "transform 0.1s ease",
      },
      
      paddingLeft: "40px", // Accommodate the left icon
      paddingRight: "40px", // Accommodate the right icon
      transition: "all 0.3s ease",
    },
    "& #reader__dashboard_section_swaplink": {
      color: "#0077b6",
      fontWeight: 500,
      textDecoration: "underline",
      "&:hover": {
        color: "#005f8d",
      },
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
      backgroundColor: "#0077b6",
      boxShadow: "0 0 15px rgba(0, 119, 182, 0.6)",
      animation: "scanLine 1.5s infinite linear",
    },
  },
  cornerBrackets: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    "&:before, &:after, & > div:before, & > div:after": {
      content: '""',
      position: "absolute",
      width: "30px",
      height: "30px",
      border: "3px solid #0077b6",
      animation: "pulseBracket 1.5s infinite ease-in-out",
    },
    "&:before": {
      top: "16px",
      left: "16px",
      borderRight: "none",
      borderBottom: "none",
    },
    "&:after": {
      top: "16px",
      right: "16px",
      borderLeft: "none",
      borderBottom: "none",
    },
    "& > div:before": {
      bottom: "16px",
      left: "16px",
      borderRight: "none",
      borderTop: "none",
    },
    "& > div:after": {
      bottom: "16px",
      right: "16px",
      borderLeft: "none",
      borderTop: "none",
    },
  },
  successAnimation: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "3rem",
    color: "#28a745",
    animation: "fadeInOut 1s ease-in-out",
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
  @keyframes glowBorder {
    0% {
      boxShadow: 0 0 5px rgba(0, 119, 182, 0.3);
    }
    50% {
      boxShadow: 0 0 15px rgba(0, 119, 182, 0.7);
    }
    100% {
      boxShadow: 0 0 5px rgba(0, 119, 182, 0.3);
    }
  }
  @keyframes pulseBracket {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }
  @keyframes fadeInOut {
    0% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.5); }
  }
  @media (prefers-reduced-motion: reduce) {
    #reader, .scanningOverlay:before, .cornerBrackets:before, .cornerBrackets:after, .cornerBrackets > div:before, .cornerBrackets > div:after, .successAnimation {
      animation: none !important;
    }
  }
`;

// Inject keyframes into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

// Customize the "Choose File" button text to "Add Image File" (if supported by the library)
document.addEventListener("DOMContentLoaded", () => {
  const fileInputButton = document.querySelector("#reader__dashboard_section_csr button");
  if (fileInputButton) {
    fileInputButton.textContent = "Add Image File";
  }
});

function PatientCard({ CIN, nom, prenom, telephone, dateNaissance, nationalite, index }) {
  const avatarColors = ["#0077b6", "#0096c7", "#00b4d8"];
  const avatarBgColor = avatarColors[index % avatarColors.length];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <SoftBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        p={3}
        gap={2}
        width="100%"
        sx={{
          backgroundColor: "#F9FAFB",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: avatarBgColor,
            fontSize: "1.8rem",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Person fontSize="large" />
        </Avatar>

        <SoftBox flex="1" minWidth={0} display="flex" flexDirection="column" gap={1.5}>
          <SoftTypography variant="h5" fontWeight="bold" color="dark" noWrap>
            {nom} {prenom}
          </SoftTypography>
          <SoftTypography variant="body2" color="text.secondary" fontWeight="medium">
            CIN: {CIN}
          </SoftTypography>

          <SoftBox display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }} gap={2} mt={1}>
            <DetailItem icon={<Phone />} label="PHONE" value={telephone} />
            <DetailItem icon={<Cake />} label="BIRTH DATE" value={dateNaissance} />
            <DetailItem icon={<Public />} label="NATIONALITY" value={nationalite} />
          </SoftBox>
        </SoftBox>

        <SoftBox display="flex" gap={1} ml={{ sm: "auto" }} mt={{ xs: 2, sm: 0 }}>
          <IconButton
            color="info"
            onClick={handleOpen}
            aria-label={`View Details of ${nom} ${prenom}`}
          >
            <VisibilityOutlined sx={{ fontSize: "1.8rem" }} />
          </IconButton>
        </SoftBox>
      </SoftBox>

      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open}>
          <SoftBox sx={modalStyle}>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <SoftTypography variant="h5" fontWeight="bold">
                Détails du Patient
              </SoftTypography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </SoftBox>
            <Divider sx={{ mb: 2 }} />
            <SoftBox display="flex" flexDirection="column" gap={2}>
              <DetailItemModal icon={<Person />} label="CIN" value={CIN} />
              <DetailItemModal icon={<Phone />} label="Phone" value={telephone} />
              <DetailItemModal icon={<Cake />} label="Birth Date" value={dateNaissance} />
              <DetailItemModal icon={<Public />} label="Nationality" value={nationalite} />
            </SoftBox>
          </SoftBox>
        </Fade>
      </Modal>
    </>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <SoftBox display="flex" alignItems="center" gap={1.5}>
      <SoftBox color="text.secondary">{icon}</SoftBox>
      <SoftBox>
        <SoftTypography variant="caption" fontWeight="medium" color="text.secondary" textTransform="uppercase">
          {label}
        </SoftTypography>
        <SoftTypography variant="body2" fontWeight="medium" color="dark" mt={0.25}>
          {value}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

function DetailItemModal({ label, value, icon }) {
  return (
    <SoftBox display="flex" alignItems="center" gap={2}>
      <SoftBox color="text.secondary" display="flex" alignItems="center">
        {icon}
      </SoftBox>
      <SoftBox>
        <SoftTypography variant="body2" fontWeight="medium" color="text.secondary" textTransform="uppercase">
          {label}
        </SoftTypography>
        <SoftTypography variant="body1" fontWeight="medium" color="dark" mt={0.5}>
          {value}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

PatientCard.propTypes = {
  CIN: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  prenom: PropTypes.string.isRequired,
  telephone: PropTypes.string.isRequired,
  dateNaissance: PropTypes.string.isRequired,
  nationalite: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

DetailItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

DetailItemModal.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

function ListPatientData() {
  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // 🔁 Load patients from localStorage when component mounts
  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem("patientsList")) || [];
    setPatients(storedPatients);
  }, []);

  const savePatientsToLocalStorage = (newPatients) => {
    localStorage.setItem("patientsList", JSON.stringify(newPatients));
  };

  const handleClearSearch = () => setSearch("");

  const handleScanSuccess = async (CIN) => {
    setScanSuccess(true);
    setTimeout(async () => {
      setSearch(CIN);
      setScannerOpen(false);
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/patients?CIN=${CIN}`);
        if (response.data && response.data.length > 0) {
          const scannedPatient = response.data[0];
          const alreadyExists = patients.some((p) => p.CIN === scannedPatient.CIN);
          if (!alreadyExists) {
            const newPatients = [...patients, scannedPatient];
            setPatients(newPatients);
            savePatientsToLocalStorage(newPatients);
          }
          localStorage.setItem("scannedPatient", JSON.stringify(scannedPatient));
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
        setScanSuccess(false);
      }
    }, 1000); // Delay to show success animation
  };

  const handleScanError = (err) => {
    console.error("QR Scan Error:", err);
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

  const filteredPatients = search
    ? patients.filter(
        (p) =>
          p.nom.toLowerCase().includes(search.toLowerCase()) ||
          p.prenom.toLowerCase().includes(search.toLowerCase()) ||
          p.CIN.toLowerCase().includes(search.toLowerCase())
      )
    : patients;

  return (
    <SoftBox width="100%" maxWidth="1200px" mx="auto" p={3}>
      <SoftBox display="flex" alignItems="center" gap={1} mb={2}>
        <Person sx={{ fontSize: "2.5rem", color: "#344767" }} aria-hidden="true" />
        <SoftTypography variant="h4" fontWeight="bold">
          Patients List
        </SoftTypography>
      </SoftBox>

      <SoftBox mb={3} display="flex" flexDirection="column" gap={2}>
        <SoftBox display="flex" alignItems="center" gap={2}>
          <SoftButton
            onClick={() => setScannerOpen(!scannerOpen)}
            sx={scannerStyles.scannerButton}
            startIcon={<QrCodeScanner />}
        
            aria-label={scannerOpen ? "Close QR Code Scanner" : "Open QR Code Scanner"}
            title={scannerOpen ? "Close QR Code Scanner" : "Open QR Code Scanner"}
          >
            {scannerOpen ? "Close Scanner" : "Scan QR Code"}
          </SoftButton>
        </SoftBox>

        {scannerOpen && (
          <SoftBox sx={scannerStyles.scannerContainer}>
            {/* Scanner Header */}
            <SoftBox sx={scannerStyles.scannerHeader}>
              <SoftTypography variant="h6" fontWeight="medium">
                QR Code Scanner
              </SoftTypography>
              <IconButton
                onClick={() => setScannerOpen(false)}
                sx={{ color: "#666" }}
                aria-label="Close QR Code Scanner"
                title="Close Scanner"
              >
                <Close />
              </IconButton>
            </SoftBox>

            {/* Scanner Area */}
            <SoftBox sx={scannerStyles.scannerArea}>
              <QRCodeScanner onScanSuccess={handleScanSuccess} onError={handleScanError} />
              <SoftBox sx={scannerStyles.scanningOverlay} />
              <SoftBox sx={scannerStyles.cornerBrackets}>
                <div />
              </SoftBox>
              {scanSuccess && (
                <SoftBox sx={scannerStyles.successAnimation}>
                  ✅
                </SoftBox>
              )}
            </SoftBox>

            {/* Instructions */}
            <SoftBox sx={scannerStyles.instructions}>
              <SoftTypography variant="body1" color="text.secondary">
                Align the patient’s QR code within the frame to scan their medical ID, or upload an image.
              </SoftTypography>
              <SoftButton
                onClick={() => fileInputRef.current.click()}
                sx={scannerStyles.uploadButton}
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
            </SoftBox>
          </SoftBox>
        )}
      </SoftBox>

      <SoftBox mb={3} display="flex" alignItems="center" gap={2}>
        <TextField
          variant="outlined"
          placeholder="Search By Name, CIN, Surname ......."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{
            maxWidth: "400px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#fff",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </SoftBox>

      <SoftBox display="flex" flexDirection="column" gap={2}>
        {loading ? (
          <SoftBox textAlign="center" py={3}>
            <SoftTypography variant="h6" color="text.secondary">
              Loading Data
            </SoftTypography>
          </SoftBox>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <PatientCard
              key={patient.CIN}
              CIN={patient.CIN}
              nom={patient.nom}
              prenom={patient.prenom}
              telephone={patient.tel}
              dateNaissance={patient.dateNaissance}
              nationalite={patient.nationalite}
              index={index}
            />
          ))
        ) : (
          <SoftBox textAlign="center" py={3}>
            <SoftTypography variant="h6" color="text.secondary">
              No Patient Found
            </SoftTypography>
          </SoftBox>
        )}
      </SoftBox>
    </SoftBox>
  );
}

export default ListPatientData;