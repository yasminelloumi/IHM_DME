import { useState, useEffect } from "react";
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
  AddAPhoto,
  Send,
  MonitorHeart,
  Person,
  DarkMode,
  LightMode,
  LocalHospital,
} from "@mui/icons-material";
import { getImages, uploadImage } from "services/imagesService";
import { getDMEByPatientId } from "services/dmeService";

// Placeholder patient data
const patientData = {
  heartRate: 76,
};

// Component for displaying vital stats
function VitalsCard({ heartRate }) {
  return (
    <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
      <CardContent>
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
function HumanModelCard({ darkMode }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: darkMode ? "#2c3e50" : "#fff",
        textAlign: "center",
      }}
    >
      <CardContent>
        <SoftTypography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "white" : "dark"}>
          3D Human Model
        </SoftTypography>
        <SoftBox
          component="img"
          src="https://png.pngtree.com/png-clipart/20240416/original/pngtree-full-human-body-x-ray-bone-png-image_14839089.png"
          alt="3D Human Model"
          sx={{
            width: "100%",
            maxWidth: "300px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </CardContent>
    </Card>
  );
}

HumanModelCard.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

// Main Component
function ImagingCenterWorkspace({ centerName }) {
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dmeRecords, setDmeRecords] = useState([]);
  const [selectedDme, setSelectedDme] = useState("");
  const [selectedImgTest, setSelectedImgTest] = useState("");
  const [isLoadingDme, setIsLoadingDme] = useState(false);
  const [dmeError, setDmeError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Fetch DME records and images on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingDme(true);
      setDmeError(null);

      try {
        // Safely retrieve and parse scannedPatient from localStorage
        let scannedPatient = null;
        try {
          const storedPatient = localStorage.getItem("scannedPatient");
          console.log("Stored patient data:", storedPatient); // Debug log
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
          CIN: scannedPatient.CIN || "Not provided", // Include CIN
          heartRate: patientData.heartRate,
        });

        // Fetch DME records
        const records = await getDMEByPatientId(patientId);
        const dmeArray = Array.isArray(records) ? records : records.data || [];
        const validDMEs = dmeArray.filter((dme) => dme.imgTest && dme.imgTest.length > 0);
        setDmeRecords(validDMEs);

        if (validDMEs.length > 0) {
          // Check for stored DME in localStorage
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

        // Fetch images
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
    console.log("Selected file:", file); // Debug log
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
  
    console.log("Submitting image:", newImageFile); // Debug log
  
    setUploadLoading(true);
    setUploadError(null);
  
    try {
      const formData = new FormData();
      formData.append("image", newImageFile);
      formData.append("patientId", userData.id);
      formData.append("description", newComment || `Image: ${newImageFile.name}`);
      formData.append("dmeId", selectedDme);
      formData.append("imgTest", selectedImgTest);
  
      // Log formData entries for debugging
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
  
      // Reset form
      setNewImageFile(null);
      setNewComment("");
      setSelectedDme("");
      setSelectedImgTest("");
      localStorage.removeItem("selectedImgTest");
      localStorage.removeItem("scannedDMEImaging");
    } catch (error) {
      console.error("Image upload error:", error);
      setUploadError(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

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
          ? "linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%)"
          : "linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
        padding: { xs: 2, md: 4 },
      }}
    >
      {/* Header */}
      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        p={2}
        sx={{ background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#fff", borderRadius: "16px" }}
      >
        <SoftBox display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "#0077b6" }}>
            <LocalHospital />
          </Avatar>
          <SoftBox>
            <SoftTypography variant="h6" color={darkMode ? "gray" : "text.secondary"}>
              Imaging Center
            </SoftTypography>
            <SoftTypography variant="h5" color={darkMode ? "white" : "dark"}>
              {centerName}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={toggleDarkMode} color="info" />}
          label={
            <SoftBox display="flex" alignItems="center" gap={1}>
              {darkMode ? <DarkMode /> : <LightMode sx={{ color: "#f9a825" }} />}
              <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
                Theme
              </SoftTypography>
            </SoftBox>
          }
          labelPlacement="start"
        />
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
          {/* Patient Info */}
          <Card sx={{ background: darkMode ? "#2c3e50" : "#fff" }}>
            <CardContent>
              <SoftBox display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "#0077b6" }}>
                  <Person />
                </Avatar>
                <SoftBox>
                  <SoftTypography variant="h6" color={darkMode ? "white" : "dark"}>
                    {userData?.name || "Loading..."}
                  </SoftTypography>
                  <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
                    CIN: {userData?.CIN || "Not provided"}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card sx={{ background: darkMode ? "#2c3e50" : "#fff" }}>
            <CardContent>
              <SoftTypography variant="h6" color={darkMode ? "white" : "dark"} mb={2}>
                Upload Medical Images
              </SoftTypography>

              {/* DME Dropdown */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: darkMode ? "#e0e0e0" : "text.secondary" }}>
                  Select Test
                </InputLabel>
                <Select
                  value={selectedDme && selectedImgTest ? `${selectedDme}|${selectedImgTest}` : ""}
                  onChange={handleDmeChange}
                  sx={{
                    backgroundColor: darkMode ? "#34495e" : "#fff",
                    color: darkMode ? "#e0e0e0" : "#333",
                  }}
                >
                  {dmeRecords.length === 0 ? (
                    <MenuItem disabled>No imaging tests available</MenuItem>
                  ) : (
                    dmeRecords.flatMap((dme) =>
                      dme.imgTest.map((test) => (
                        <MenuItem key={`${dme.id}|${test}`} value={`${dme.id}|${test}`}>
                        {test} - ({new Date(dme.dateConsultation).toLocaleDateString()})
                        </MenuItem>
                      ))
                    )
                  )}
                </Select>
              </FormControl>

              {/* Image Upload */}
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
                }}
              >
                <AddAPhoto sx={{ color: darkMode ? "#e0e0e0" : "#0077b6", mr: 1 }} />
                <SoftTypography variant="body1" color={darkMode ? "gray" : "text.secondary"}>
                  {newImageFile ? newImageFile.name : "Click to upload an image"}
                </SoftTypography>
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </SoftBox>

              {/* Comment Input */}
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Add a description..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Submit Button */}
              <SoftButton
                variant="gradient"
                color="info"
                onClick={handleImageSubmit}
                disabled={uploadLoading || !newImageFile || !selectedDme || !selectedImgTest}
                startIcon={uploadLoading ? <CircularProgress size={20} /> : <Send />}
              >
                {uploadLoading ? "Uploading..." : "Submit Image"}
              </SoftButton>

              {/* Image Previews */}
              <SoftBox display="flex" flexWrap="wrap" gap={2} mt={3}>
                {images.map((image) => (
                  <Card key={image.id} sx={{ width: 150, background: darkMode ? "#34495e" : "#f9f9f9" }}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={`http://localhost:3002${image.url}`}
                      alt={image.description}
                      sx={{ borderRadius: "12px 12px 0 0" }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <SoftTypography variant="caption" color={darkMode ? "gray" : "text.secondary"}>
                        {image.description}
                      </SoftTypography>
                      <SoftTypography variant="caption" display="block" color={darkMode ? "gray" : "text.secondary"}>
                        DME: {image.dmeId} - {image.imgTest}
                      </SoftTypography>
                    </CardContent>
                  </Card>
                ))}
              </SoftBox>
            </CardContent>
          </Card>

        </SoftBox>

        {/* Right Section */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          <VitalsCard heartRate={userData?.heartRate || patientData.heartRate} />
          <HumanModelCard darkMode={darkMode} />
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

ImagingCenterWorkspace.propTypes = {
  centerName: PropTypes.string.isRequired,
};

export default ImagingCenterWorkspace;