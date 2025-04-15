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
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AddAPhoto,
  Send,
  MonitorHeart,
  Person,
  DarkMode,
  LightMode,
  LocalHospital,
  Close,
} from "@mui/icons-material";

// API Configuration
const API_URL = "http://localhost:3001/images";

// Patient data
const patientData = {
  name: "Sarah Connor",
  id: "PAT-12345",
  heartRate: 76,
};

// VitalsCard Component
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

// HumanModelCard Component
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
function CentresImageries({ centerName }) {
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch images from API
  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_URL}?patientId=${patientData.id}`);
      if (!response.ok) throw new Error('Failed to fetch images');
      return await response.json();
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  };

  // Upload image to API
  const uploadImage = async (imageData) => {
    try {
      const formData = new FormData();
      formData.append('image', imageData.file);
      formData.append('patientId', patientData.id);
      formData.append('description', imageData.description);
  
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      // Transform the response to match your expected format
      return {
        id: result.data.id,
        url: result.data.url,
        description: result.data.description,
        dateCreation: result.data.dateCreated,
        dmeId: result.data.patientId
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(error.message || 'Failed to upload image');
    }
  };
  // Load images on mount
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        const patientImages = await fetchImages();
        setImages(patientImages);
      } catch (err) {
        setError(err.message);
        showSnackbar(err.message, "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadImages();
  }, []);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    try {
      setIsLoading(true);
      const previewUrl = URL.createObjectURL(file);
      
      const uploadedImage = await uploadImage({
        file,
        description: `Medical Image - ${new Date().toLocaleDateString()}`
      });
  
      setImages(prev => [...prev, {
        ...uploadedImage,
        previewUrl // Temporary URL for immediate display
      }]);
      
      showSnackbar("Image uploaded successfully!", "success");
    } catch (err) {
      console.error("Upload failed:", err);
      showSnackbar(`Upload failed: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
      event.target.value = ''; // Reset input
    }
  };
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        text: newComment,
        timestamp: new Date().toLocaleString(),
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
      showSnackbar("Comment added!", "success");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (isLoading) {
    return (
      <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </SoftBox>
    );
  }

  if (error) {
    return (
      <SoftBox p={4} textAlign="center">
        <Alert severity="error">{error}</Alert>
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
            <LocalHospital fontSize="large" />
          </Avatar>
          <SoftBox>
            <SoftTypography
              variant="h6"
              fontWeight="bold"
              color={darkMode ? "gray" : "text.secondary"}
            >
              Imaging Center
            </SoftTypography>
            <SoftTypography variant="h2" fontWeight="bold" color={darkMode ? "white" : "dark"}>
              {centerName}
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
      <SoftBox display="grid" gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }} gap={4}>
        {/* Left Section */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          {/* Patient Info Card */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: darkMode ? "#2c3e50" : "#fff",
            }}
          >
            <CardContent>
              <SoftBox display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "#0077b6", width: 48, height: 48 }}>
                  <Person fontSize="large" />
                </Avatar>
                <SoftBox>
                  <SoftTypography variant="h6" fontWeight="bold" color={darkMode ? "white" : "dark"}>
                    {patientData.name}
                  </SoftTypography>
                  <SoftTypography variant="body2" color={darkMode ? "gray" : "text.secondary"}>
                    Patient ID: {patientData.id}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: darkMode ? "#2c3e50" : "#fff",
            }}
          >
            <CardContent>
              <SoftTypography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "white" : "dark"}>
                Upload Medical Images
              </SoftTypography>
              <SoftBox
                component="label"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
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
                <AddAPhoto sx={{ color: darkMode ? "#e0e0e0" : "#0077b6", fontSize: "2rem", mr: 1 }} />
                <SoftTypography variant="body1" color={darkMode ? "gray" : "text.secondary"}>
                  Click to upload an image
                </SoftTypography>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                  aria-label="Upload medical image"
                />
              </SoftBox>

              {/* Image Previews */}
              <SoftBox display="flex" flexWrap="wrap" gap={2} mt={3}>
                {images.map((image) => (
                  <Card
                    key={image.id}
                    sx={{
                      width: 150,
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      background: darkMode ? "#34495e" : "#f9f9f9",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="100"
                      image={image.url || image.previewUrl}
                      alt={image.description}
                      sx={{ borderRadius: "12px 12px 0 0" }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <SoftTypography
                        variant="caption"
                        color={darkMode ? "gray" : "text.secondary"}
                        textAlign="center"
                      >
                        {image.description}
                      </SoftTypography>
                      <SoftTypography
                        variant="caption"
                        color={darkMode ? "gray" : "text.secondary"}
                        textAlign="center"
                        display="block"
                      >
                        {new Date(image.dateCreated).toLocaleDateString()}
                      </SoftTypography>
                    </CardContent>
                  </Card>
                ))}
              </SoftBox>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: darkMode ? "#2c3e50" : "#fff",
            }}
          >
            <CardContent>
              <SoftTypography variant="h6" fontWeight="bold" mb={2} color={darkMode ? "white" : "dark"}>
                Comments & Notes
              </SoftTypography>

              {/* Comment Input */}
              <SoftBox display="flex" alignItems="center" gap={2} mb={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
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
                    "aria-label": "Add a comment",
                  }}
                />
                <SoftButton
                  variant="gradient"
                  color="info"
                  onClick={handleCommentSubmit}
                  sx={{ borderRadius: "12px", px: 3 }}
                  startIcon={<Send />}
                  aria-label="Submit comment"
                >
                  Send
                </SoftButton>
              </SoftBox>

              {/* Comment History */}
              <SoftBox maxHeight="200px" sx={{ overflowY: "auto" }}>
                {comments.map((comment) => (
                  <SoftBox key={comment.id} mb={2}>
                    <SoftTypography
                      variant="body2"
                      color={darkMode ? "gray" : "text.secondary"}
                      mb={0.5}
                    >
                      {comment.timestamp}
                    </SoftTypography>
                    <SoftTypography variant="body1" color={darkMode ? "white" : "dark"}>
                      {comment.text}
                    </SoftTypography>
                    <Divider sx={{ my: 1, borderColor: darkMode ? "#444" : "#e0e0e0" }} />
                  </SoftBox>
                ))}
              </SoftBox>
            </CardContent>
          </Card>
        </SoftBox>

        {/* Right Section */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          <VitalsCard heartRate={patientData.heartRate} />
          <HumanModelCard darkMode={darkMode} />
        </SoftBox>
      </SoftBox>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          action={
            <SoftButton
              color="inherit"
              size="small"
              onClick={handleSnackbarClose}
              endIcon={<Close fontSize="small" />}
            >
              Close
            </SoftButton>
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SoftBox>
  );
}

CentresImageries.propTypes = {
  centerName: PropTypes.string.isRequired,
};

export default CentresImageries;
