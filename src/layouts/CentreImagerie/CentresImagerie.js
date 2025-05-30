import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import {
  Avatar,
  Switch,
  FormControlLabel,
  TextField,
  Divider,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  AddAPhoto,
  Send,
  MonitorHeart,
  Person,
  LocalHospital,
  Image,
  Comment,
  AccessibilityNew,
} from "@mui/icons-material";
import { getImages, uploadImage } from "services/imagesService";
import { getDMEByPatientId } from "services/dmeService";

// Placeholder patient data
const patientData = {
  heartRate: 76,
};

// Define global styles for consistency
const styles = {
  card: {
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
  },
  sendButton: {
    background: "linear-gradient(135deg, #0077b6 0%, #005f91 100%)",
    color: "#fff",
    borderRadius: "12px",
    px: 3,
    py: 1.5,
    fontWeight: "bold",
    "&:hover": {
      background: "linear-gradient(135deg, #005f91 0%, #004b73 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 119, 182, 0.3)",
    },
    "&:disabled": {
      background: "linear-gradient(135deg, #cccccc 0%, #b3b3b3 100%)",
      color: "#666",
    },
    transition: "all 0.3s ease",
  },
};

// Component for displaying vital stats
function VitalsCard({ heartRate }) {
  return (
    <Card sx={styles.card}>
      <CardContent>
        <SoftBox sx={styles.sectionTitle}>
          <MonitorHeart sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
          <SoftTypography variant="h6" fontWeight="bold">
            Vitals
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex" alignItems="center" gap={2}>
          <MonitorHeart sx={{ color: "#0077b6", fontSize: "2rem" }} />
          <SoftBox>
            <SoftTypography variant="body2" color="text.secondary" textTransform="uppercase">
              Heart Rate
            </SoftTypography>
            <SoftTypography variant="h6" fontWeight="bold" color="dark">
              {heartRate} bpm
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </CardContent>
    </Card>
  );
}

VitalsCard.propTypes = {
  heartRate: PropTypes.number.isRequired,
};

// Component for displaying 3D human model
function HumanModelCard() {
  return (
    <Card sx={styles.card}>
      <CardContent>
        <SoftBox sx={styles.sectionTitle}>
          <AccessibilityNew sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
          <SoftTypography variant="h6" fontWeight="bold">
            3D Human Model
          </SoftTypography>
        </SoftBox>
        <SoftBox
          component="img"
          src="https://png.pngtree.com/png-clipart/20240416/original/pngtree-full-human-body-x-ray-bone-png-image_14839089.png"
          alt="3D Human Model"
          sx={{
            width: "100%",
            maxWidth: "300px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            display: "block",
            margin: "0 auto",
          }}
        />
      </CardContent>
    </Card>
  );
}

// Main Component
function ImagingCenterWorkspace({ centerName }) {
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userData, setUserData] = useState(null);
  const [dmeRecords, setDmeRecords] = useState([]);
  const [selectedDme, setSelectedDme] = useState("");
  const [selectedImgTest, setSelectedImgTest] = useState("");
  const [isLoadingDme, setIsLoadingDme] = useState(false);
  const [dmeError, setDmeError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Added darkMode state
  const fileInputRef = useRef(null);

  // Fetch DME records and images on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingDme(true);
      setDmeError(null);

      try {
        let scannedPatient = null;
        try {
          const storedPatient = localStorage.getItem("scannedPatient");
          console.log("Stored patient data:", storedPatient);
          if (storedPatient) {
            scannedPatient = JSON.parse(storedPatient);
          }
        } catch (parseError) {
          console.error("Error parsing scannedPatient from localStorage:", parseError);
        }

        if (!scannedPatient || !scannedPatient.id) {
          setDmeError("Patient not found. Please select a patient to proceed.");
          setIsLoadingDme(false);
          return;
        }

        const patientId = scannedPatient.id;
        setUserData({
          name: `${scannedPatient.prenom} ${scannedPatient.nom}`,
          id: patientId,
          CIN: scannedPatient.CIN || "Not provided",
          heartRate: patientData.heartRate,
        });

        const records = await getDMEByPatientId(patientId);
        const dmeArray = Array.isArray(records) ? records : records.data || [];
        const validDMEs = dmeArray.filter((dme) => dme.imgTest && dme.imgTest.length > 0);
        setDmeRecords(validDMEs);

        if (validDMEs.length > 0) {
          const storedDME = JSON.parse(localStorage.getItem("scannedDMEImaging"));
          const validStoredDME = storedDME && validDMEs.find((dme) => dme.id === storedDME.id);

          if (validStoredDME && validStoredDME.imgTest && validStoredDME.imgTest.length > 0) {
            setSelectedDme(validStoredDME.id);
            setSelectedImgTest(validStoredDME.imgTest[0]);
            localStorage.setItem("selectedImgTest", validStoredDME.imgTest[0]);
            localStorage.setItem("scannedDMEImaging", JSON.stringify(validStoredDME));
          } else {
            const defaultDME = validDMEs[0];
            setSelectedDme(defaultDME.id);
            setSelectedImgTest(defaultDME.imgTest[0]);
            localStorage.setItem("selectedImgTest", defaultDME.imgTest[0]);
            localStorage.setItem("scannedDMEImaging", JSON.stringify(defaultDME));
          }
        } else {
          setDmeError("No DME records with imaging tests found.");
        }

        const fetchedImages = await getImages(patientId);
        setImages(fetchedImages || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDmeError("Failed to load data. Please try again.");
      } finally {
        setIsLoadingDme(false);
      }
    };

    fetchData();
  }, []);

  // Handle DME and imgTest selection
  const handleDmeChange = (event) => {
    const [dmeId, imgTest] = event.target.value.split("|");
    const selected = dmeRecords.find((dme) => dme.id === dmeId);
    setSelectedDme(dmeId);
    setSelectedImgTest(imgTest);
    localStorage.setItem("selectedImgTest", imgTest);
    localStorage.setItem("scannedDMEImaging", JSON.stringify(selected));
    setUploadError(null);
  };

  // Handle image file selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    if (file && file.type.startsWith("image/")) {
      setNewImageFile(file);
      setUploadError(null);
    } else {
      setUploadError("Please select a valid image file (jpeg, jpg, png, gif).");
      setNewImageFile(null);
    }
  };

  // Handle image submission
  const handleImageSubmit = async () => {
    if (!newImageFile || !selectedDme || !selectedImgTest) {
      setUploadError("Please select an image, DME, and imaging test.");
      return;
    }

    console.log("Submitting image:", newImageFile);

    setUploadLoading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("image", newImageFile);
      formData.append("patientId", userData.id);
      formData.append("description", newComment || `Image: ${newImageFile.name}`);
      formData.append("dmeId", selectedDme);
      formData.append("imgTest", selectedImgTest);

      for (let [key, value] of formData.entries()) {
        console.log(`formData ${key}:`, value);
      }

      const uploadedImage = await uploadImage(formData);
      setImages((prev) => [uploadedImage, ...prev]);

      if (newComment.trim()) {
        setComments((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: newComment,
            timestamp: new Date().toLocaleString(),
          },
        ]);
      }

      setNewImageFile(null);
      setNewComment("");
      setSelectedDme("");
      setSelectedImgTest("");
      localStorage.removeItem("selectedImgTest");
      localStorage.removeItem("scannedDMEImaging");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setUploadError(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      return; // Prevent empty comments
    }

    setComments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: newComment,
        timestamp: new Date().toLocaleString(),
      },
    ]);

    setNewComment(""); // Clear the input field
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Filter available imaging tests
  const usedTests = images.map((image) => `${image.dmeId}|${image.imgTest}`);
  const availableTests = dmeRecords.flatMap((dme) =>
    dme.imgTest
      .map((test) => ({
        dmeId: dme.id,
        imgTest: test,
        date: dme.dateConsultation,
      }))
      .filter((test) => !usedTests.includes(`${test.dmeId}|${test.imgTest}`))
  );

  // Render loading or error states
  if (isLoadingDme) {
    return (
      <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress color="info" />
      </SoftBox>
    );
  }

  if (dmeError && !userData) {
    return (
      <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <SoftTypography variant="h6" color="error">
          {dmeError}
        </SoftTypography>
      </SoftBox>
    );
  }

  return (
    <SoftBox
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #1a2a3a 0%, #0d1b2a 100%)"
          : "linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
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
          background: darkMode ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <SoftBox display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "#0077b6" }}>
            <LocalHospital />
          </Avatar>
          <SoftBox>
            <SoftTypography
              variant="h6"
              fontWeight="bold"
              color={darkMode ? "text.primary" : "text.secondary"}
            >
              Imaging Center
            </SoftTypography>
            <SoftTypography variant="h2" fontWeight="bold" color={darkMode ? "white" : "dark"}>
              {centerName}
            </SoftTypography>
          </SoftBox>
        </SoftBox>

      </SoftBox>

      {uploadError && (
        <SoftBox mb={2} p={2} sx={{ backgroundColor: "#ffebee", borderRadius: "8px" }}>
          <SoftTypography variant="body2" color="error">
            {uploadError}
          </SoftTypography>
        </SoftBox>
      )}

      {/* Main Content */}
      <SoftBox display="grid" gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }} gap={4}>
        {/* Left Section */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          {/* Patient Info Card */}
          <Card sx={{ ...styles.card, background: darkMode ? "#2a2a2a" : "#fff" }}>
            <CardContent>
              <SoftBox sx={styles.sectionTitle}>
                <Person sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
                <SoftTypography
                  variant="h6"
                  fontWeight="bold"
                  color={darkMode ? "white" : "dark"}
                >
                  Patient Information
                </SoftTypography>
              </SoftBox>
              <SoftBox display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "#0077b6" }}>
                  <Person />
                </Avatar>
                <SoftBox>
                  <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    color={darkMode ? "white" : "dark"}
                  >
                    {userData?.name || "Loading..."}
                  </SoftTypography>
                  <SoftTypography
                    variant="body2"
                    color={darkMode ? "text.primary" : "text.secondary"}
                  >
                    CIN: {userData?.CIN || "Not provided"}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card sx={{ ...styles.card, background: darkMode ? "#2a2a2a" : "#fff" }}>
            <CardContent>
              <SoftBox sx={styles.sectionTitle}>
                <Image sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
                <SoftTypography
                  variant="h6"
                  fontWeight="bold"
                  color={darkMode ? "white" : "dark"}
                >
                  Upload Medical Images
                </SoftTypography>
              </SoftBox>

              {/* DME Dropdown */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: darkMode ? "#e0e0e0" : "#333" }}>
                  Select Test
                </InputLabel>
                <Select
                  value={selectedDme && selectedImgTest ? `${selectedDme}|${selectedImgTest}` : ""}
                  onChange={handleDmeChange}
                  sx={{
                    backgroundColor: darkMode ? "#333" : "#fff",
                    color: darkMode ? "#e0e0e0" : "#333",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#555" : "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "#777" : "rgba(0, 0, 0, 0.87)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0077b6",
                    },
                  }}
                >
                  {availableTests.length === 0 ? (
                    <MenuItem disabled>No imaging tests available</MenuItem>
                  ) : (
                    availableTests.map((test) => (
                      <MenuItem
                        key={`${test.dmeId}|${test.imgTest}`}
                        value={`${test.dmeId}|${test.imgTest}`}
                      >
                        {test.imgTest} - ({new Date(test.date).toLocaleDateString()})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <SoftBox
                component="label"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
                mb={2}
                sx={{
                  border: "2px dashed",
                  borderColor: "#0077b6",
                  borderRadius: "12px",
                  cursor: "pointer",
                  backgroundColor: darkMode ? "#333" : "transparent",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(0, 119, 182, 0.2)" : "rgba(0, 119, 182, 0.1)",
                  },
                }}
              >
                <AddAPhoto sx={{ color: "#0077b6", fontSize: "2rem", mr: 1 }} />
                <SoftTypography
                  variant="body1"
                  color={darkMode ? "text.primary" : "text.secondary"}
                >
                  {newImageFile ? newImageFile.name : "Click to upload an image"}
                </SoftTypography>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
              </SoftBox>

              {/* Comment Input */}
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add a description..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                  ...styles.textField,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: darkMode ? "#333" : "#fff",
                    color: darkMode ? "#e0e0e0" : "#333",
                    "& fieldset": {
                      borderColor: darkMode ? "#555" : "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "#777" : "rgba(0, 0, 0, 0.87)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0077b6",
                    },
                  },
                }}
              />

              {/* Submit Button */}
              <SoftButton
                variant="gradient"
                color="info"
                onClick={handleImageSubmit}
                disabled={uploadLoading || !newImageFile || !selectedDme || !selectedImgTest}
                startIcon={uploadLoading ? <CircularProgress size={20} /> : <Send />}
                sx={{ mt: 2 }}
              >
                {uploadLoading ? "Uploading..." : "Submit Image"}
              </SoftButton>

              {/* Image Previews */}
              <SoftBox display="flex" flexWrap="wrap" gap={2} mt={3}>
                {images.map((image) => (
                  <Card
                    key={image.id}
                    sx={{
                      width: 150,
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      background: darkMode ? "#333" : "#f9f9f9",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="100"
                      image={`http://localhost:3002${image.url}`}
                      alt={image.description}
                      sx={{ borderRadius: "12px 12px 0 0" }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <SoftTypography
                        variant="caption"
                        color={darkMode ? "text.primary" : "text.secondary"}
                        textAlign="center"
                      >
                        {image.description}
                      </SoftTypography>
                      <SoftTypography
                        variant="caption"
                        display="block"
                        color={darkMode ? "text.primary" : "text.secondary"}
                      >
                        DME: {image.dmeId} - {image.imgTest}
                      </SoftTypography>
                    </CardContent>
                  </Card>
                ))}
              </SoftBox>
            </CardContent>
          </Card>

          {/* Comments Section */}
            <CardContent>
              {/* Comment History */}

            </CardContent>
        </SoftBox>

        {/* Right Section */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          <VitalsCard heartRate={userData?.heartRate || patientData.heartRate} />
          <HumanModelCard />
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

ImagingCenterWorkspace.propTypes = {
  centerName: PropTypes.string.isRequired,
};

export default ImagingCenterWorkspace;