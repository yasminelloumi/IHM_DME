import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { submitReport, getReportsByPatient } from "services/reportsServices";
import { Typography } from '@mui/material';
import {
  Avatar,
  TextField,
  Divider,
  Card,
  CardContent,
  Box,
  FormControl,
  CircularProgress,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import {
  Bloodtype,
  Description,
  Person,
  UploadFile,
  Science,
  CheckCircle,
  CloudUpload,
  Timeline,
  Assignment,
  History,
} from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDMEByPatientId } from "services/dmeService";

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

// Define global styles for consistency (light theme only)
const styles = {
  card: {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    background: "#fff",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 24px rgba(0, 0, 0, 0.15)",
      transform: "translateY(-2px)",
    },
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 2,
    color: "dark",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.23)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.87)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0077b6",
      },
    },
    "& .MuiInputBase-input": {
      color: "#333",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.54)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0077b6",
    },
  },
  submitButton: {
    background: "linear-gradient(135deg, #28a745 0%, #218838 100%)",
    color: "#fff",
    borderRadius: "12px",
    mt: 2,
    px: 4,
    py: 1.5,
    fontWeight: "bold",
    "&:hover": {
      background: "linear-gradient(135deg, #218838 0%, #1e7e34 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(33, 136, 56, 0.3)",
    },
    "&:disabled": {
      background: "linear-gradient(135deg, #cccccc 0%, #b3b3b3 100%)",
      color: "#666",
    },
    transition: "all 0.3s ease",
  },
};

// Component for displaying patient information
function PatientInfoCard({ patient }) {
  const pulse = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `;
  return (
    <Card sx={styles.card}>
      <CardContent>
        <style>{pulse}</style>
        <SoftBox sx={styles.sectionTitle}>
          <Person sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
          <SoftTypography variant="h6" fontWeight="bold">
            Patient Information
          </SoftTypography>
        </SoftBox>
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
            <SoftTypography variant="h6" fontWeight="bold" color="dark">
              {patient.name}
            </SoftTypography>
            <SoftTypography variant="body2" color="text.secondary">
              Patient ID: {patient.id}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <Bloodtype sx={{ color: "#0077b6", fontSize: "1.5rem" }} />
            <SoftBox>
              <SoftTypography variant="body2" color="text.secondary" textTransform="uppercase">
                Blood Type
              </SoftTypography>
              <SoftTypography variant="body1" fontWeight="medium" color="dark">
                {patient.bloodType}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <SoftTypography variant="body2" color="text.secondary" textTransform="uppercase">
              Age
            </SoftTypography>
            <SoftTypography variant="body1" fontWeight="medium" color="dark">
              {patient.age} years
            </SoftTypography>
          </SoftBox>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <SoftTypography variant="body2" color="text.secondary" textTransform="uppercase">
              Last Visit
            </SoftTypography>
            <SoftTypography variant="body1" fontWeight="medium" color="dark">
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
};

// Component for displaying lab metrics (chart)
function LabMetricsCard({ trends }) {
  return (
    <Card sx={styles.card}>
      <CardContent>
        <SoftBox sx={styles.sectionTitle}>
          <Timeline sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
          <SoftTypography variant="h6" fontWeight="bold">
            Lab Result Trends
          </SoftTypography>
        </SoftBox>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#333" />
            <YAxis stroke="#333" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#0077b6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <SoftTypography variant="body2" color="text.secondary" textAlign="center" mt={1}>
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
};

// Component for displaying lab stats and recent test types
function LabStatsCard({ stats, testTypes }) {
  return (
    <Card sx={styles.card}>
      <CardContent>
        <SoftBox sx={styles.sectionTitle}>
          <Assignment sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
          <SoftTypography variant="h6" fontWeight="bold">
            Laboratory Stats
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex" flexDirection="column" gap={2}>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <Science sx={{ color: "#0077b6", fontSize: "1.5rem" }} />
            <SoftBox>
              <SoftTypography variant="body2" color="text.secondary" textTransform="uppercase">
                Tests This Month
              </SoftTypography>
              <SoftTypography variant="body1" fontWeight="medium" color="dark">
                {stats.testsThisMonth}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
          <SoftBox display="flex" alignItems="center" gap={1}>
            <SoftTypography variant="body2" color="text.secondary" textTransform="uppercase">
              Avg Turnaround Time
            </SoftTypography>
            <SoftTypography variant="body1" fontWeight="medium" color="dark">
              {stats.avgTurnaroundTime}
            </SoftTypography>
          </SoftBox>
          <Divider sx={{ borderColor: "#e0e0e0" }} />
          <SoftTypography variant="h6" fontWeight="bold" mt={1} color="dark">
            Recent Test Types
          </SoftTypography>
          {testTypes.map((test, index) => (
            <SoftTypography
              key={index}
              variant="body1"
              color="dark"
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
};

// Main Component
function LaboratoryWorkspace({ labName }) {
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [labStatsData, setLabStatsData] = useState(labStats);
  const [testTypes, setTestTypes] = useState(recentTestTypes);
  const [labTrendsData, setLabTrendsData] = useState(labTrends);
  const [newReportFile, setNewReportFile] = useState(null);
  const [newReportDescription, setNewReportDescription] = useState("");
  const [selectedLabTest, setSelectedLabTest] = useState("");
  const [dmeList, setDmeList] = useState([]);
  const [selectedDME, setSelectedDME] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch patient data, reports, and DME data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Retrieve patient data from localStorage
        const patientInfo = JSON.parse(localStorage.getItem("scannedPatient"));

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

        // Fetch reports for the patient
        if (patientDataToUse.id) {
          const fetchedReports = await getReportsByPatient(patientDataToUse.id);
          console.log("Fetched reports:", fetchedReports);
          setReports(fetchedReports);
        } else {
          setReports([]);
        }

        // Fetch DME data for the patient
        if (patientDataToUse.id) {
          const fetchedDMEs = await getDMEByPatientId(patientDataToUse.id);
          const validDMEs = fetchedDMEs.filter(dme => dme.laboTest && dme.laboTest.length > 0);
          console.log("Fetched DMEs:", validDMEs);

          if (validDMEs.length > 0) {
            setDmeList(validDMEs);

            // Check if a valid DME is stored in localStorage
            const storedDME = JSON.parse(localStorage.getItem("scannedDME"));
            const validStoredDME = storedDME && validDMEs.find(dme => dme.id === storedDME.id && dme.patientId === patientDataToUse.id);

            if (validStoredDME && validStoredDME.laboTest && validStoredDME.laboTest.length > 0) {
              const firstAvailableTest = validStoredDME.laboTest[0];
              console.log("Using stored DME with first available test:", firstAvailableTest);
              setSelectedDME(validStoredDME);
              setSelectedLabTest(firstAvailableTest);
              localStorage.setItem("selectedLabTest", firstAvailableTest);
              localStorage.setItem("scannedDME", JSON.stringify(validStoredDME));
            } else {
              // Select the first DME with an available lab test
              const defaultDME = validDMEs[0];
              const firstTest = defaultDME.laboTest[0];
              console.log("Selecting default DME with first test:", firstTest);
              setSelectedDME(defaultDME);
              setSelectedLabTest(firstTest);
              localStorage.setItem("selectedLabTest", firstTest);
              localStorage.setItem("scannedDME", JSON.stringify(defaultDME));
            }
          } else {
            setDmeList([]);
            setSelectedDME(null);
            setSelectedLabTest("");
            localStorage.removeItem("selectedLabTest");
            setError("No DME data with valid lab tests found for this patient.");
            localStorage.removeItem("scannedDME");
          }
        } else {
          setDmeList([]);
          setSelectedDME(null);
          setSelectedLabTest("");
          localStorage.removeItem("selectedLabTest");
          localStorage.removeItem("scannedDME");
        }
      } catch (err) {
        setError(`Failed to load data: ${err.message || "Unknown error"}`);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle DME and lab test selection
  const handleDMEChange = (event, newValue) => {
    if (newValue && newValue.value !== "default") {
      const [dmeId, labTest] = newValue.value.split("|");
      const selected = dmeList.find(dme => dme.id === dmeId);
      console.log("Selected DME and lab test:", { dmeId, labTest });
      setSelectedDME(selected);
      setSelectedLabTest(labTest);
      localStorage.setItem("selectedLabTest", labTest);
      localStorage.setItem("scannedDME", JSON.stringify(selected));
      setError(null);
    } else {
      console.log("Cleared DME and lab test selection");
      setSelectedDME(null);
      setSelectedLabTest("");
      localStorage.removeItem("selectedLabTest");
      localStorage.removeItem("scannedDME");
    }
  };

  // Handle report file upload
  const handleReportUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      console.log("Uploaded file:", file.name);
      setNewReportFile(file);
      setError(null);
    } else {
      setError("Please select a valid PDF file.");
      setNewReportFile(null);
    }
  };

  // Handle report submission
  const handleReportSubmit = async () => {
    if (!newReportFile || !newReportDescription.trim() || !patient?.id || !selectedLabTest || !selectedDME?.id) {
      setError("Please select a PDF file, add a description, choose a lab test, select a DME, and ensure patient data is available.");
      console.log("Submission blocked due to missing data");
      return;
    }

    setSubmitLoading(true);
    setError(null);

    try {
      const labTestName = localStorage.getItem("selectedLabTest")?.replace(/\.pdf$/i, '').trim();

      if (!labTestName) {
        throw new Error("No valid lab test name found in localStorage.");
      }

      console.log("Submitting report with:", {
        labTestName,
        selectedLabTest,
        dmeId: selectedDME.id,
        uploadedFileName: newReportFile.name,
      });

      const formData = new FormData();
      formData.append("file", newReportFile);
      formData.append("patientId", patient.id);
      formData.append("description", newReportDescription);
      formData.append("dmeId", selectedDME.id);
      formData.append("labTest", selectedLabTest);

      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key}=${value}`);
      }

      const response = await submitReport(formData);
      console.log("Report submitted successfully:", response);

      const newReport = {
        id: response.id,
        patientId: patient.id,
        fileName: response.fileName,
        description: newReportDescription,
        timestamp: response.timestamp || new Date().toISOString(),
        filePath: response.filePath,
        dmeId: response.dmeId || selectedDME.id,
        labTest: response.labTest || selectedLabTest,
      };

      // Update reports and reset form
      setReports([newReport, ...reports]);
      setNewReportFile(null);
      setNewReportDescription("");
      setSelectedLabTest("");
      setSelectedDME(null);
      localStorage.removeItem("selectedLabTest");
      localStorage.removeItem("scannedDME");
      console.log("Form reset after submission");
    } catch (error) {
      console.error("Error submitting report:", error);
      setError(error.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Derive used lab tests from reports
  const usedTests = reports.map((report) => `${report.dmeId}|${report.labTest}`);

  // Prepare options for Autocomplete, excluding used tests
  const autocompleteOptions = [
    { label: "--Select a choice--", value: "default" },
    ...dmeList.flatMap((dme) =>
      dme.laboTest
        .filter((labTest) => !usedTests.includes(`${dme.id}|${labTest}`))
        .map((labTest) => ({
          label: `${labTest} - (${new Date(dme.dateConsultation).toLocaleDateString()})`,
          value: `${dme.id}|${labTest}`,
        }))
    ),
  ];
  console.log("Generated autocompleteOptions:", autocompleteOptions);

  // Render loading or error states
  if (loading) {
    return (
      <SoftBox
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "url('https://via.placeholder.com/1920x1080?text=Lab-Background'), linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: { xs: 2, md: 4 },
          color: "#1a2a3a",
        }}
      >
        <SoftTypography variant="h6" color="dark">
          Loading...
        </SoftTypography>
      </SoftBox>
    );
  }

  if (error && !patient) {
    return (
      <SoftBox
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "url('https://via.placeholder.com/1920x1080?text=Lab-Background'), linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: { xs: 2, md: 4 },
          color: "#1a2a3a",
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
        background: "url('https://via.placeholder.com/1920x1080?text=Lab-Background'), linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: { xs: 3, md: 5 },
        color: "#1a2a3a",
      }}
    >
      {/* Header */}
      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        p={3}
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
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
              color="text.secondary"
            >
              Laboratory
            </SoftTypography>
            <SoftTypography variant="h5" fontWeight="bold" color="dark">
              {labName}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>

      {/* Error Message (non-blocking) */}
      {error && (
        <SoftBox mb={2} p={2} sx={{ backgroundColor: "#ffebee", borderRadius: "8px" }}>
          <SoftTypography variant="body2" color="error">
            {error}
          </SoftTypography>
        </SoftBox>
      )}

      {/* Main Content */}
      <SoftBox
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
        gap={4}
      >
        {/* Left Section: Patient Info, Report Upload, and Report History */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          {/* Patient Info Card */}
          <PatientInfoCard patient={patient || patientData} />

          {/* Report Upload Section */}
          <Card sx={styles.card}>
            <CardContent>
              <SoftBox sx={styles.sectionTitle}>
                <CloudUpload sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
                <SoftTypography variant="h6" fontWeight="bold">
                  Upload New Report
                </SoftTypography>
              </SoftBox>
              <SoftBox
                component="label"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
                mb={3}
                sx={{
                  border: "2px dashed",
                  borderColor: "#0077b6",
                  borderRadius: "12px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(0, 119, 182, 0.1)",
                  },
                }}
              >
                <UploadFile sx={{ color: "#0077b6", fontSize: "2rem", mr: 1 }} />
                <SoftTypography variant="body1" color="text.secondary">
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
              <SoftTypography variant="body1" fontWeight="medium" mb={1} color="dark">
                Report Description
              </SoftTypography>
              <TextField
                fullWidth
                label="Description"
                placeholder="Add a description for the report..."
                value={newReportDescription}
                onChange={(e) => setNewReportDescription(e.target.value)}
                sx={styles.textField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description sx={{ color: "#0077b6" }} />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  "aria-label": "Add a description for the report",
                }}
              />
              <SoftButton
                onClick={handleReportSubmit}
                sx={styles.submitButton}
                startIcon={<CheckCircle />}
                disabled={!newReportFile || !newReportDescription.trim()}
                aria-label="Submit laboratory report"
              >
                {submitLoading ? "Submitting..." : "Submit Report"}
              </SoftButton>
            </CardContent>
          </Card>

          {/* Report History Section */}
          <Card sx={styles.card}>
            <CardContent>
              <SoftBox sx={styles.sectionTitle}>
                <History sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
                <SoftTypography variant="h6" fontWeight="bold">
                  Report History
                </SoftTypography>
              </SoftBox>
              <SoftBox maxHeight="300px" sx={{ overflowY: "auto" }}>
                {reports.length > 0 ? (
                  reports.map((report) => {
                    console.log("Rendering report:", report);
                    return (
                      <SoftBox key={report.id} mb={2}>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                          <Description sx={{ color: "#0077b6" }} />
                          <SoftTypography
                            variant="body1"
                            fontWeight="medium"
                            color="dark"
                          >
                            {report.labTest || "Unnamed Report"}
                          </SoftTypography>
                        </SoftBox>
                        <SoftTypography
                          variant="body2"
                          color="text.secondary"
                          mt={0.5}
                        >
                          Test Creation's Date: {new Date(report.timestamp).toLocaleString()}
                        </SoftTypography>
                        <SoftTypography variant="body1" color="dark" mt={0.5}>
                         Description: {report.description}
                        </SoftTypography>
                        <Divider sx={{ my: 1, borderColor: "#e0e0e0" }} />
                      </SoftBox>
                    );
                  })
                ) : (
                  <SoftTypography variant="body1" color="text.secondary" textAlign="center">
                    No reports available for this patient.
                  </SoftTypography>
                )}
              </SoftBox>
            </CardContent>
          </Card>
        </SoftBox>

        {/* Right Section: Lab Metrics and Stats */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          <LabMetricsCard trends={labTrendsData} />
          <LabStatsCard stats={labStatsData} testTypes={testTypes} />
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

LaboratoryWorkspace.propTypes = {
  labName: PropTypes.string.isRequired,
};

export default LaboratoryWorkspace;