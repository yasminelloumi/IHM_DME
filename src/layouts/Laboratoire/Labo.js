import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { submitReport, getReportsByPatient } from "services/reportsServices";
import {
  Avatar,
  Switch,
  FormControlLabel,
  TextField,
  Divider,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {
  Bloodtype,
  Description,
  Person,
  DarkMode,
  LightMode,
  UploadFile,
  Science,
} from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Placeholder patient data (used as fallback)
const patientData = {
  name: "John Doe",
  id: "PAT-67890",
  bloodType: "O+",
  age: 34,
  lastVisit: "2025-04-10",
};



// Placeholder for recent test types
const recentTestTypes = [
  "Complete Blood Count (CBC)",
  "Lipid Panel",
  "Blood Glucose",
];

// Placeholder for lab stats
const labStats = {
  testsThisMonth: 120,
  avgTurnaroundTime: "24 hours",
};

// Placeholder for lab result trends
const labTrends = [
  { date: "2025-04-01", value: 5.2 },
  { date: "2025-03-05", value: 5.5 },
  { date: "2025-02-10", value: 5.0 },
];

// Component for displaying patient information
function PatientInfoCard({ patient, darkMode }) {
  const pulse = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `;
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: darkMode ? "#2c3e50" : "#fff",
      }}
    >
      <CardContent>
        <style>{pulse}</style>
        <SoftBox display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            sx={{
              bgcolor: "#0077b6",
              width: 48,
              height: 48,
              animation: "pulse 2s infinite",
            }}
          >
            <Person fontSize="large" />
          </Avatar>
          <SoftBox>
            <SoftTypography variant="h6" fontWeight="bold" color={darkMode ? "white" : "dark"}>
              {patient.name}
            </SoftTypography>
            <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
              Patient ID: {patient.id}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <Bloodtype sx={{ color: darkMode ? "#e0e0e0" : "#0077b6", fontSize: "1.5rem" }} />
            <SoftBox>
              <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"} textTransform="uppercase">
                Blood Type
              </SoftTypography>
              <SoftTypography variant="body1" fontWeight="medium" color={darkMode ? "white" : "dark"}>
                {patient.bloodType}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"} textTransform="uppercase">
              Age
            </SoftTypography>
            <SoftTypography variant="body1" fontWeight="medium" color={darkMode ? "white" : "dark"}>
              {patient.age} years
            </SoftTypography>
          </SoftBox>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"} textTransform="uppercase">
              Last Visit
            </SoftTypography>
            <SoftTypography variant="body1" fontWeight="medium" color={darkMode ? "white" : "dark"}>
              {patient.lastVisit}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </CardContent>
    </Card>
  );
}

PatientInfoCard.propTypes = {
  patient: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    bloodType: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    lastVisit: PropTypes.string.isRequired,
  }).isRequired,
  darkMode: PropTypes.bool.isRequired,
};

// Component for displaying lab metrics (chart)
function LabMetricsCard({ trends, darkMode }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: darkMode ? "#2c3e50" : "#fff",
      }}
    >
      <CardContent>
        <SoftTypography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "white" : "dark"}>
          Lab Result Trends
        </SoftTypography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#e0e0e0"} />
            <XAxis dataKey="date" stroke={darkMode ? "#e0e0e0" : "#333"} />
            <YAxis stroke={darkMode ? "#e0e0e0" : "#333"} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#34495e" : "#fff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#0077b6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"} textAlign="center" mt={1}>
          Recent Blood Glucose Levels (mmol/L)
        </SoftTypography>
      </CardContent>
    </Card>
  );
}

LabMetricsCard.propTypes = {
  trends: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  darkMode: PropTypes.bool.isRequired,
};

// Component for displaying lab stats and recent test types
function LabStatsCard({ stats, testTypes, darkMode }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: darkMode ? "#2c3e50" : "#fff",
      }}
    >
      <CardContent>
        <SoftTypography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "white" : "dark"}>
          Laboratory Stats
        </SoftTypography>
        <SoftBox display="flex" flexDirection="column" gap={2}>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <Science sx={{ color: darkMode ? "#e0e0e0" : "#0077b6", fontSize: "1.5rem" }} />
            <SoftBox>
              <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"} textTransform="uppercase">
                Tests This Month
              </SoftTypography>
              <SoftTypography variant="body1" fontWeight="medium" color={darkMode ? "white" : "dark"}>
                {stats.testsThisMonth}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"} textTransform="uppercase">
              Avg Turnaround Time
            </SoftTypography>
            <SoftTypography variant="body1" fontWeight="medium" color={darkMode ? "white" : "dark"}>
              {stats.avgTurnaroundTime}
            </SoftTypography>
          </SoftBox>
          <Divider sx={{ borderColor: darkMode ? "#444" : "#e0e0e0" }} />
          <SoftTypography variant="h6" fontWeight="bold" mt={1} color={darkMode ? "white" : "dark"}>
            Recent Test Types
          </SoftTypography>
          {testTypes.map((test, index) => (
            <SoftTypography
              key={index}
              variant="body1"
              color={darkMode ? "white" : "dark"}
              ml={2}
            >
              • {test}
            </SoftTypography>
          ))}
        </SoftBox>
      </CardContent>
    </Card>
  );
}

LabStatsCard.propTypes = {
  stats: PropTypes.shape({
    testsThisMonth: PropTypes.number.isRequired,
    avgTurnaroundTime: PropTypes.string.isRequired,
  }).isRequired,
  testTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  darkMode: PropTypes.bool.isRequired,
};

// Main Component
function LaboratoryWorkspace({ labName }) {
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]); // Initialize as empty, will filter from initialReports
  const [labStatsData, setLabStatsData] = useState(labStats);
  const [testTypes, setTestTypes] = useState(recentTestTypes);
  const [labTrendsData, setLabTrendsData] = useState(labTrends);
  const [newReportFile, setNewReportFile] = useState(null);
  const [newReportDescription, setNewReportDescription] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set patient data and filter reports on component mount
  // LaboratoryWorkspace.jsx
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      // Retrieve patient data from localStorage
      const patientInfo = JSON.parse(localStorage.getItem("connectedUser"));

      let patientDataToUse = patientData; // Default to placeholder

      if (patientInfo) {
        const birthDate = new Date(patientInfo.dateNaissance);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        patientDataToUse = {
          name: `${patientInfo.prenom} ${patientInfo.nom}`,
          id: patientInfo.id,
          bloodType: patientInfo.bloodType || patientData.bloodType,
          age: age,
          lastVisit: patientInfo.lastVisit || patientData.lastVisit,
        };
      } else {
        setError("Patient data not found in localStorage. Using placeholder data.");
      }

      setPatient(patientDataToUse);

      // Fetch reports for the patient from the backend
      if (patientDataToUse.id) {
        const fetchedReports = await getReportsByPatient(patientDataToUse.id);
        setReports(fetchedReports);
      } else {
        setReports([]);
      }
    } catch (err) {
      setError("Failed to load data. Using placeholder data.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  // Handle report file upload
  const handleReportUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewReportFile(file);
    }
  };

  // Handle report submission
  // LaboratoryWorkspace.jsx
// src/components/LaboratoryWorkspace.jsx (or Labo.js)
// Partial update for handleReportSubmit
// Partial update for handleReportSubmit
const handleReportSubmit = async () => {
  if (!newReportFile || !newReportDescription.trim() || !patient?.id) {
    setError("Please select a file and add a description.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", newReportFile);
    formData.append("patientId", patient.id);
    formData.append("description", newReportDescription);

    // Add content type header for FormData
    const response = await submitReport(formData);

    const newReport = {
      id: response.id,
      patientId: patient.id,
      fileName: newReportFile.name,
      description: newReportDescription,
      timestamp: new Date().toISOString(),
      filePath: response.filePath
    };

    setReports([newReport, ...reports]);
    setNewReportFile(null);
    setNewReportDescription("");
    setError(null);
  } catch (error) {
    console.error("Error submitting report:", error);
    setError(error.message || "Failed to submit report. Please try again.");
  }
};
  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Render loading or error states
  if (loading) {
    return (
      <SoftBox
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: darkMode
            ? "linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%)"
            : "url('https://placehold.co/1920x1080?text=Lab-Background'), linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: { xs: 2, md: 4 },
          color: darkMode ? "#e0e0e0" : "#1a2a3a",
        }}
      >
        <SoftTypography variant="h6" color={darkMode ? "white" : "dark"}>
          Loading...
        </SoftTypography>
      </SoftBox>
    );
  }

  if (error) {
    return (
      <SoftBox
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: darkMode
            ? "linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%)"
            : "url('https://placehold.co/1920x1080?text=Lab-Background'), linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: { xs: 2, md: 4 },
          color: darkMode ? "#e0e0e0" : "#1a2a3a",
        }}
      >
        <SoftTypography variant="h6" color="error">
          {error}
        </SoftTypography>
      </SoftBox>
    );
  }

  return (
    <SoftBox
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%)"
          : "url('https://via.placeholder.com/1920x1080?text=Lab-Background'), linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: { xs: 2, md: 4 },
        color: darkMode ? "#e0e0e0" : "#1a2a3a",
      }}
    >
      {/* Header */}
      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        p={2}
        sx={{
          background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <SoftBox display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "#0077b6", width: 48, height: 48 }}>
            <Science fontSize="large" />
          </Avatar>
          <SoftBox>
            <SoftTypography
              variant="h6"
              fontWeight="medium"
              color={darkMode ? "gray" : "text.secondary"}
            >
              Laboratory
            </SoftTypography>
            <SoftTypography variant="h5" fontWeight="bold" color={darkMode ? "white" : "dark"}>
              {labName}
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

      {/* Main Content */}
      <SoftBox
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
        gap={4}
      >
        {/* Left Section: Patient Info, Report Upload, and Report History */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          {/* Patient Info Card */}
          <PatientInfoCard patient={patient || patientData} darkMode={darkMode} />

          {/* Report Upload Section */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: darkMode ? "#2c3e50" : "#fff",
            }}
          >
            <CardContent>
              <SoftTypography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "white" : "dark"}>
                Add Laboratory Report
              </SoftTypography>
              <SoftBox
                component="label"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
                mb={2}
                sx={{
                  border: "2px dashed",
                  borderColor: darkMode ? "#e0e0e0" : "#0077b6",
                  borderRadius: "12px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 119, 182, 0.1)",
                  },
                }}
              >
                <UploadFile sx={{ color: darkMode ? "#e0e0e0" : "#0077b6", fontSize: "2rem", mr: 1 }} />
                <SoftTypography variant="body1" color={darkMode ? "gray" : "text.secondary"}>
                  {newReportFile ? newReportFile.name : "Click to upload a report (PDF)"}
                </SoftTypography>
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={handleReportUpload}
                  aria-label="Upload laboratory report"
                />
              </SoftBox>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a description for the report..."
                value={newReportDescription}
                onChange={(e) => setNewReportDescription(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: darkMode ? "#34495e" : "#fff",
                    "& fieldset": {
                      borderColor: darkMode ? "#e0e0e0" : "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "#fff" : "rgba(0, 0, 0, 0.87)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0077b6",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: darkMode ? "#e0e0e0" : "#333",
                  },
                }}
                inputProps={{
                  "aria-label": "Add a description for the report",
                }}
              />
              <SoftButton
                variant="gradient"
                color="info"
                onClick={handleReportSubmit}
                sx={{ borderRadius: "12px", mt: 2, px: 3 }}
                startIcon={<UploadFile />}
                disabled={!newReportFile || !newReportDescription.trim()}
                aria-label="Submit laboratory report"
              >
                Submit Report
              </SoftButton>
            </CardContent>
          </Card>

          {/* Report History Section */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: darkMode ? "#2c3e50" : "#fff",
            }}
          >
            <CardContent>
              <SoftTypography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "white" : "dark"}>
                Report History
              </SoftTypography>
              <SoftBox maxHeight="300px" sx={{ overflowY: "auto" }}>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <SoftBox key={report.id} mb={2}>
                      <SoftBox display="flex" alignItems="center" gap={1}>
                        <Description sx={{ color: darkMode ? "#e0e0e0" : "#0077b6" }} />
                        <SoftTypography
                          variant="body1"
                          fontWeight="medium"
                          color={darkMode ? "white" : "dark"}
                        >
                          {report.fileName}
                        </SoftTypography>
                      </SoftBox>
                      <SoftTypography
                        variant="body2"
                        color={darkMode ? "gray" : "text.secondary"}
                        mt={0.5}
                      >
                        {new Date(report.timestamp).toLocaleString()}
                      </SoftTypography>
                      <SoftTypography variant="body1" color={darkMode ? "white" : "dark"} mt={0.5}>
                        {report.description}
                      </SoftTypography>
                      <Divider sx={{ my: 1, borderColor: darkMode ? "#444" : "#e0e0e0" }} />
                    </SoftBox>
                  ))
                ) : (
                  <SoftTypography variant="body1" color={darkMode ? "gray" : "text.secondary"} textAlign="center">
                    No reports available for this patient.
                  </SoftTypography>
                )}
              </SoftBox>
            </CardContent>
          </Card>
        </SoftBox>

        {/* Right Section: Lab Metrics and Stats */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          <LabMetricsCard trends={labTrendsData} darkMode={darkMode} />
          <LabStatsCard stats={labStatsData} testTypes={testTypes} darkMode={darkMode} />
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

LaboratoryWorkspace.propTypes = {
  labName: PropTypes.string.isRequired,
};

export default LaboratoryWorkspace;