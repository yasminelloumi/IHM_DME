import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import {
  Avatar,
  TextField,
  Divider,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import {
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

// Placeholder patient data
const patientData = {
  name: "Sarah Connor",
  id: "PAT-12345",
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
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "Initial X-Ray shows no fractures.",
      timestamp: "2025-04-13 10:30 AM",
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [userData, setUserData] = useState(null);

  // Fetch images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log("Attempting to fetch images...");
        const fetchedImages = await getImages();
        console.log("Fetched images:", fetchedImages);
        setImages(fetchedImages);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };
    fetchImages();

    const scannedPatient = JSON.parse(localStorage.getItem("scannedPatient"));
    if (scannedPatient) {
      setUserData({
        name: `${scannedPatient.prenom} ${scannedPatient.nom}`,
        id: scannedPatient.CIN || scannedPatient.id || "N/A",
        heartRate: 76,
      });
    }
  }, []);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file); // Temporary URL for preview
      const imageData = {
        patientId: userData?.id || patientData.id,
        description: `${file.name} - ${new Date().toLocaleDateString()}`,
        url: tempUrl,
      };
      console.log("Uploading image data:", imageData);
      try {
        const uploadedImage = await uploadImage(imageData);
        console.log("Uploaded image:", uploadedImage);
        setImages((prevImages) => [...prevImages, uploadedImage]);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image: " + error.message);
      }
    }
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        text: newComment,
        timestamp: new Date().toLocaleString(),
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  return (
    <SoftBox
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
        padding: { xs: 2, md: 4 },
        color: "#1a2a3a",
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
          background: "rgba(255, 255, 255, 0.9)",
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
              color="text.secondary"
            >
              Imaging Center
            </SoftTypography>
            <SoftTypography variant="h2" fontWeight="bold" color="dark">
              {centerName}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>

      {/* Main Content */}
      <SoftBox
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
        gap={4}
      >
        {/* Left Section: Image Upload and Comments */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          {/* Patient Info Card */}
          <Card sx={styles.card}>
            <CardContent>
              <SoftBox sx={styles.sectionTitle}>
                <Person sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
                <SoftTypography variant="h6" fontWeight="bold">
                  Patient Information
                </SoftTypography>
              </SoftBox>
              <SoftBox display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "#0077b6", width: 48, height: 48 }}>
                  <Person fontSize="large" />
                </Avatar>
                <SoftBox>
                  <SoftTypography variant="h6" fontWeight="bold" color="dark">
                    {userData ? userData.name : "Loading..."}
                  </SoftTypography>
                  <SoftTypography variant="body2" color="text.secondary">
                    CIN: {userData ? userData.id : "Loading..."}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card sx={styles.card}>
            <CardContent>
              <SoftBox sx={styles.sectionTitle}>
                <Image sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
                <SoftTypography variant="h6" fontWeight="bold">
                  Upload Medical Images
                </SoftTypography>
              </SoftBox>
              <SoftBox
                component="label"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={3}
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
                <AddAPhoto sx={{ color: "#0077b6", fontSize: "2rem", mr: 1 }} />
                <SoftTypography variant="body1" color="text.secondary">
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
                      background: "#f9f9f9",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="100"
                      image={image.url}
                      alt={image.description}
                      sx={{ borderRadius: "12px 12px 0 0" }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <SoftTypography
                        variant="caption"
                        color="text.secondary"
                        textAlign="center"
                      >
                        {image.description}
                      </SoftTypography>
                    </CardContent>
                  </Card>
                ))}
              </SoftBox>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card sx={styles.card}>
            <CardContent>
              <SoftBox sx={styles.sectionTitle}>
                <Comment sx={{ color: "#0077b6", fontSize: "1.8rem" }} />
                <SoftTypography variant="h6" fontWeight="bold">
                  Comments & Notes
                </SoftTypography>
              </SoftBox>

              {/* Comment Input */}
              <SoftBox display="flex" alignItems="center" gap={2} mb={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={styles.textField}
                  inputProps={{
                    "aria-label": "Add a comment",
                  }}
                />
                <SoftButton
                  onClick={handleCommentSubmit}
                  sx={styles.sendButton}
                  startIcon={<Send />}
                  disabled={!newComment.trim()}
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
                      color="text.secondary"
                      mb={0.5}
                    >
                      {comment.timestamp}
                    </SoftTypography>
                    <SoftTypography variant="body1" color="dark">
                      {comment.text}
                    </SoftTypography>
                    <Divider sx={{ my: 1, borderColor: "#e0e0e0" }} />
                  </SoftBox>
                ))}
              </SoftBox>
            </CardContent>
          </Card>
        </SoftBox>

        {/* Right Section: Vitals and 3D Human Model */}
        <SoftBox display="flex" flexDirection="column" gap={4}>
          <VitalsCard heartRate={patientData.heartRate} />
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