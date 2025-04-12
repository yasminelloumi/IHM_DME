import { useEffect, useState } from "react";
import "./style.css";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";

// ✅ Import the update function
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
      <Header />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={4}></Grid>
          <Grid item xs={12} md={6} xl={4}>
            {profile && (
              <ProfileInfoCard
                title="Profile Information"
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
              />
            )}
          </Grid>
          <Grid item xs={12} xl={4}></Grid>
        </Grid>
      </SoftBox>

      {/* Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
        <DialogTitle className="dialog-title">Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="nom"
            label="Nom"
            fullWidth
            value={editedProfile.nom || ""}
            onChange={handleEditChange}
            className="dialog-input"
          />
          <TextField
            margin="dense"
            name="prenom"
            label="Prénom"
            fullWidth
            value={editedProfile.prenom || ""}
            onChange={handleEditChange}
            className="dialog-input"
          />
          <TextField
            margin="dense"
            name="tel"
            label="Téléphone"
            fullWidth
            value={editedProfile.tel || ""}
            onChange={handleEditChange}
            className="dialog-input"
          />
          <TextField
            margin="dense"
            name="dateNaissance"
            label="Date de naissance"
            fullWidth
            value={editedProfile.dateNaissance || ""}
            onChange={handleEditChange}
            className="dialog-input"
          />
          <TextField
            margin="dense"
            name="nationalite"
            label="Nationalité"
            fullWidth
            value={editedProfile.nationalite || ""}
            onChange={handleEditChange}
            className="dialog-input"
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setEditOpen(false)} className="dialog-button cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" className="dialog-button save">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
