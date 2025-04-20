// src/layouts/ListPatientData/ListDatas.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QrCodeScanner } from "@mui/icons-material";
import { Card } from "@mui/material";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";

import QRCodeScanner from "layouts/TablePatient/data/QRCodeScanner";
import ListPatientData from "./data/ListPatientData";

function ListDatas() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();

  const handleScanSuccess = async (CIN) => {
    setScannerOpen(false);
    try {
      const response = await axios.get(`http://localhost:3001/patients?CIN=${CIN}`);
      if (response.data && response.data.length > 0) {
        const scannedPatient = response.data[0];
        localStorage.setItem("scannedPatient", JSON.stringify(scannedPatient));

        alert(`Patient ${scannedPatient.nom} ${scannedPatient.prenom} loaded!`);

        // 👉 Get connected user from localStorage
        const connectedUser = JSON.parse(localStorage.getItem("connectedUser"));

        if (connectedUser?.role === "centreImagerie") {
          navigate("/imaging");
        } else if (connectedUser?.role === "laboratoire") {
          navigate("/laboratory");
        } else {
          alert("Unrecognized role. Cannot navigate.");
        }
      } else {
        alert("Patient not found.");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const handleScanError = (err) => {
    console.error("QR Scan Error:", err);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox mt={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
        <SoftButton
          variant="gradient"
          color="info"
          onClick={() => setScannerOpen(!scannerOpen)}
          startIcon={<QrCodeScanner />}
          sx={{ borderRadius: "12px", px: 3 }}
        >
          {scannerOpen ? "Fermer le Scanner" : "Scanner un QR Code"}
        </SoftButton>

        {scannerOpen && (
          <SoftBox
            sx={{
              borderRadius: "16px",
              backgroundColor: "#fff",
              p: 2,
              border: "2px solid #0077b6",
              maxWidth: "400px",
            }}
          >
            <QRCodeScanner onScanSuccess={handleScanSuccess} onError={handleScanError} />
          </SoftBox>
        )}
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default ListDatas;
