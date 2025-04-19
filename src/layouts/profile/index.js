import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PublicIcon from "@mui/icons-material/Public";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Import QR Code
import { QRCodeSVG } from "qrcode.react";

// Import the update function
import { updatePatientProfile } from "services/profileService";

function Overview() {
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("connectedUser");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setProfile(user);
      setEditedProfile(user);
    }
  }, []);

  const handleEditClick = () => {
    setEditedProfile(profile);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updated = await updatePatientProfile(profile.id, editedProfile);
      setProfile(updated);
      localStorage.setItem("connectedUser", JSON.stringify(updated));
      setEditOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <DashboardLayout>
      {/* Custom Header */}
      <SoftBox
        py={3}
        px={2}
        sx={{
          backgroundColor: "#0077b6",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          mb: 4,
        }}
      >
        <SoftBox display="flex" alignItems="center">
          <MedicalServicesIcon sx={{ fontSize: "2rem", mr: 1 }} />
          <SoftTypography variant="h5" fontWeight="bold">
            Medical Profile Dashboard
          </SoftTypography>
        </SoftBox>
        <SoftTypography variant="body2">
          {profile ? `${profile.nom} ${profile.prenom}` : "User"}
        </SoftTypography>
      </SoftBox>

      {/* Main Content */}
      <SoftBox mb={3} px={2}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            {profile ? (
              <Card
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  borderLeft: "4px solid #0077b6",
                }}
              >
                <Grid container spacing={3}>
                  {/* Left Column: Person Icon, Name, and QR Code */}
                  <Grid item xs={12} md={4} display="flex" justifyContent="center">
                    <SoftBox display="flex" flexDirection="column" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: "#0077b6",
                          width: 64,
                          height: 64,
                          mb: 2,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: "2rem", color: "#fff" }} />
                      </Avatar>
                      <SoftTypography variant="h6" fontWeight="bold" color="#333" mb={2}>
                        {profile.nom} {profile.prenom}
                      </SoftTypography>
                      <SoftBox
                        sx={{
                          border: "1px solid #e0f2ff",
                          borderRadius: "8px",
                          backgroundColor: "#fff",
                          padding: 2,
                          mb: 2,
                        }}
                      >
                        <QRCodeSVG
                          value={profile.CIN || ""}
                          size={120}
                          level="H"
                          includeMargin
                          style={{ display: "block" }}
                        />
                      </SoftBox>
                      <SoftTypography
                        variant="caption"
                        color="#666"
                        textAlign="center"
                        display="block"
                        sx={{ fontWeight: 500 }}
                      >
                        Medical ID: {profile.CIN}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>

                  {/* Right Column: Profile Information */}
                  <Grid item xs={12} md={8}>
                    <SoftBox>
                      <SoftTypography variant="h6" fontWeight="bold" color="#333" mb={2}>
                        Profile Details
                      </SoftTypography>
                      <ProfileInfoCard
                        description={`Hello, I'm ${profile.nom} ${profile.prenom}`}
                        info={{
                          cin: profile.CIN,
                          fullName: `${profile.nom} ${profile.prenom}`,
                          mobile: profile.tel,
                          birthDate: profile.dateNaissance,
                          nationality: profile.nationalite,
                        }}
                        action={{
                          route: "",
                          tooltip: "Edit Profile",
                          onClick: handleEditClick,
                        }}
                        sx={{
                          "& .MuiTypography-root": {
                            color: "#333",
                            mb: 1,
                            fontSize: "0.95rem",
                          },
                          "& .MuiTypography-body2": {
                            fontSize: "1rem",
                            color: "#666",
                            fontWeight: "medium",
                          },
                          "& .MuiButtonBase-root": {
                            color: "#0077b6",
                            fontSize: "0.9rem",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            "&:hover": {
                              backgroundColor: "#e0f2ff",
                            },
                            "&:focus": {
                              outline: "2px solid #0077b6",
                            },
                          },
                        }}
                      />
                    </SoftBox>
                  </Grid>
                </Grid>
              </Card>
            ) : (
              <SoftTypography variant="body1" color="#666" textAlign="center">
                No profile data available. Please log in.
              </SoftTypography>
            )}
          </Grid>
        </Grid>
      </SoftBox>

      {/* Modernized Modal Form */}
    <Dialog
  open={editOpen}
  onClose={() => setEditOpen(false)}
  fullWidth
  maxWidth="sm"
  sx={{
    "& .MuiDialog-paper": {
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      overflow: "hidden",
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: "#fff",
      color: "#333",
      fontWeight: "bold",
      fontSize: "1.5rem",
      borderBottom: "1px solid #e0e0e0",
      py: 3,
      px: 4,
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <MedicalServicesIcon sx={{ color: "#0077b6", fontSize: "1.75rem" }} />
    Update Your Medical Profile
  </DialogTitle>
  <DialogContent sx={{ py: 4, px: 4 }}>
    <SoftBox mt={4}> {/* Increased from mt={2} to mt={4} for more spacing */}
      <TextField
        margin="normal"
        name="nom"
        label="Last Name"
        fullWidth
        value={editedProfile.nom || ""}
        onChange={handleEditChange}
        variant="outlined"
        required
        error={!editedProfile.nom}
        helperText={!editedProfile.nom ? "Last name is required" : ""}
        InputProps={{
          startAdornment: (
            <PersonIcon sx={{ color: "#0077b6", fontSize: "1.5rem", mr: 1.5 }} />
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#e0e0e0" },
            "&:hover fieldset": { borderColor: "#0077b6" },
            "&.Mui-focused fieldset": {
              borderColor: "#0077b6",
              boxShadow: "0 0 8px rgba(0, 119, 182, 0.2)",
            },
            borderRadius: "12px",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            padding: "4px 0",
          },
          "& .MuiOutlinedInput-input": {
            padding: "14px 14px",
          },
          "& .MuiInputLabel-root": {
            color: "#666",
            fontSize: "1.1rem",
            top: "-2px",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#0077b6",
          },
          "& .MuiFormHelperText-root": {
            color: "#d32f2f",
            fontSize: "0.9rem",
            ml: 1,
          },
        }}
      />
      <TextField
        margin="normal"
        name="prenom"
        label="First Name"
        fullWidth
        value={editedProfile.prenom || ""}
        onChange={handleEditChange}
        variant="outlined"
        required
        error={!editedProfile.prenom}
        helperText={!editedProfile.prenom ? "First name is required" : ""}
        InputProps={{
          startAdornment: (
            <PersonIcon sx={{ color: "#0077b6", fontSize: "1.5rem", mr: 1.5 }} />
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#e0e0e0" },
            "&:hover fieldset": { borderColor: "#0077b6" },
            "&.Mui-focused fieldset": {
              borderColor: "#0077b6",
              boxShadow: "0 0 8px rgba(0, 119, 182, 0.2)",
            },
            borderRadius: "12px",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            padding: "4px 0",
          },
          "& .MuiOutlinedInput-input": {
            padding: "14px 14px",
          },
          "& .MuiInputLabel-root": {
            color: "#666",
            fontSize: "1.1rem",
            top: "-2px",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#0077b6",
          },
          "& .MuiFormHelperText-root": {
            color: "#d32f2f",
            fontSize: "0.9rem",
            ml: 1,
          },
        }}
      />
      <TextField
        margin="normal"
        name="tel"
        label="Phone Number"
        fullWidth
        value={editedProfile.tel || ""}
        onChange={handleEditChange}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <PhoneIcon sx={{ color: "#0077b6", fontSize: "1.5rem", mr: 1.5 }} />
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#e0e0e0" },
            "&:hover fieldset": { borderColor: "#0077b6" },
            "&.Mui-focused fieldset": {
              borderColor: "#0077b6",
              boxShadow: "0 0 8px rgba(0, 119, 182, 0.2)",
            },
            borderRadius: "12px",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            padding: "4px 0",
          },
          "& .MuiOutlinedInput-input": {
            padding: "14px 14px",
          },
          "& .MuiInputLabel-root": {
            color: "#666",
            fontSize: "1.1rem",
            top: "-2px",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#0077b6",
          },
        }}
      />
      <TextField
        margin="normal"
        name="dateNaissance"
        label="Date of Birth"
        fullWidth
        value={editedProfile.dateNaissance || ""}
        onChange={handleEditChange}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <CalendarTodayIcon sx={{ color: "#0077b6", fontSize: "1.5rem", mr: 1.5 }} />
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#e0e0e0" },
            "&:hover fieldset": { borderColor: "#0077b6" },
            "&.Mui-focused fieldset": {
              borderColor: "#0077b6",
              boxShadow: "0 0 8px rgba(0, 119, 182, 0.2)",
            },
            borderRadius: "12px",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            padding: "4px 0",
          },
          "& .MuiOutlinedInput-input": {
            padding: "14px 14px",
          },
          "& .MuiInputLabel-root": {
            color: "#666",
            fontSize: "1.1rem",
            top: "-2px",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#0077b6",
          },
        }}
      />
      <TextField
        margin="normal"
        name="nationalite"
        label="Nationality"
        fullWidth
        value={editedProfile.nationalite || ""}
        onChange={handleEditChange}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <PublicIcon sx={{ color: "#0077b6", fontSize: "1.5rem", mr: 1.5 }} />
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#e0e0e0" },
            "&:hover fieldset": { borderColor: "#0077b6" },
            "&.Mui-focused fieldset": {
              borderColor: "#0077b6",
              boxShadow: "0 0 8px rgba(0, 119, 182, 0.2)",
            },
            borderRadius: "12px",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            padding: "4px 0",
          },
          "& .MuiOutlinedInput-input": {
            padding: "14px 14px",
          },
          "& .MuiInputLabel-root": {
            color: "#666",
            fontSize: "1.1rem",
            top: "-2px",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#0077b6",
          },
        }}
      />
    </SoftBox>
  </DialogContent>
  <DialogActions
    sx={{
      backgroundColor: "#fff",
      borderTop: "1px solid #e0e0e0",
      py: 3,
      px: 4,
      gap: 2,
    }}
  >
    <Button
      onClick={() => setEditOpen(false)}
      sx={{
        color: "#666",
        textTransform: "none",
        fontSize: "1rem",
        padding: "10px 20px",
        borderRadius: "8px",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
        "&:focus": {
          outline: "2px solid #0077b6",
        },
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleSave}
      variant="contained"
      sx={{
        backgroundColor: "#0077b6",
        color: "#fff",
        textTransform: "none",
        fontSize: "1rem",
        padding: "10px 20px",
        borderRadius: "8px",
        "&:hover": {
          backgroundColor: "#005f8d",
        },
        "&:focus": {
          outline: "2px solid #0077b6",
        },
      }}
    >
      Save Changes
    </Button>
  </DialogActions>
</Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;