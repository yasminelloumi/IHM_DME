import { useState } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
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
} from "@mui/icons-material";

// Style pour la pop-up
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

// Composant PatientCard (modifié pour inclure la pop-up)
function PatientCard({ cin, nom, prenom, telephone, dateNaissance, nationalite, index }) {
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
            CIN: {cin}
          </SoftTypography>

          <SoftBox display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(3, 1fr)" }} gap={2} mt={1}>
            <DetailItem icon={<Phone />} label="TÉLÉPHONE" value={telephone} />
            <DetailItem icon={<Cake />} label="DATE DE NAISSANCE" value={dateNaissance} />
            <DetailItem icon={<Public />} label="NATIONALITÉ" value={nationalite} />
          </SoftBox>
        </SoftBox>

        <SoftBox display="flex" gap={1} ml={{ sm: "auto" }} mt={{ xs: 2, sm: 0 }}>
          <IconButton
            color="info"
            onClick={handleOpen}
            aria-label={`Voir les détails de ${nom} ${prenom}`}
          >
            <VisibilityOutlined sx={{ fontSize: "1.8rem" }} />
          </IconButton>
        </SoftBox>
      </SoftBox>

      {/* Pop-up pour les détails du patient */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="patient-details-title"
        aria-describedby="patient-details-description"
        closeAfterTransition
      >
        <Fade in={open}>
          <SoftBox sx={modalStyle}>
            {/* En-tête de la pop-up */}
            <SoftBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <SoftTypography id="patient-details-title" variant="h5" fontWeight="bold">
                Détails du Patient
              </SoftTypography>
              <IconButton onClick={handleClose} aria-label="Fermer la fenêtre">
                <Close sx={{ fontSize: "1.5rem", color: "text.secondary" }} />
              </IconButton>
            </SoftBox>

            {/* Contenu de la pop-up */}
            <SoftBox id="patient-details-description">
              <SoftBox display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: avatarBgColor,
                    fontSize: "1.5rem",
                  }}
                >
                  <Person fontSize="large" />
                </Avatar>
                <SoftTypography variant="h6" fontWeight="bold" color="dark">
                  {nom} {prenom}
                </SoftTypography>
              </SoftBox>

              <Divider sx={{ mb: 2 }} />

              <SoftBox display="flex" flexDirection="column" gap={2}>
                <DetailItemModal label="CIN" value={cin} icon={<Person />} />
                <DetailItemModal label="Téléphone" value={telephone} icon={<Phone />} />
                <DetailItemModal label="Date de Naissance" value={dateNaissance} icon={<Cake />} />
                <DetailItemModal label="Nationalité" value={nationalite} icon={<Public />} />
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Fade>
      </Modal>
    </>
  );
}

PatientCard.propTypes = {
  cin: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  prenom: PropTypes.string.isRequired,
  telephone: PropTypes.string.isRequired,
  dateNaissance: PropTypes.string.isRequired,
  nationalite: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

// Sous-composant pour les détails dans la pop-up
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

DetailItemModal.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

// Sous-composant pour les détails dans la carte
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

DetailItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

// Données statiques
const patients = [
  {
    cin: "AB123456",
    nom: "BENALI",
    prenom: "AHMED",
    telephone: "+212 6 12 34 56 78",
    dateNaissance: "15/03/1985",
    nationalite: "MAROCAIN",
  },
  {
    cin: "CD789012",
    nom: "EL FASSI",
    prenom: "FATIMA",
    telephone: "+212 6 98 76 54 32",
    dateNaissance: "22/07/1990",
    nationalite: "MAROCAINE",
  },
];

function ListPatientData() {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.cin.toLowerCase().includes(search.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <SoftBox width="100%" maxWidth="1200px" mx="auto" p={3}>
      <SoftTypography variant="h4" mb={2} fontWeight="bold">
        Liste des Patients
      </SoftTypography>

      {/* Zone de recherche */}
      <SoftBox mb={3} display="flex" alignItems="center" gap={2}>
        <TextField
          variant="outlined"
          placeholder="Rechercher par nom, prénom ou CIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{
            maxWidth: "400px",
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
              padding: "10px 14px",
              fontSize: "0.95rem",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "text.secondary", fontSize: "1.2rem" }} />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} size="small" aria-label="Effacer la recherche">
                  <Clear sx={{ color: "text.secondary", fontSize: "1.2rem" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            "aria-label": "Rechercher un patient par nom, prénom ou CIN",
          }}
        />
      </SoftBox>

      {/* Liste des patients */}
      <SoftBox display="flex" flexDirection="column" gap={2}>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <div key={index}>
              <PatientCard {...patient} index={index} />
            </div>
          ))
        ) : (
          <SoftBox textAlign="center" py={3}>
            <SoftTypography variant="body1" color="text.secondary">
              Aucun patient trouvé pour la recherche `{search}`.
            </SoftTypography>
            {search && (
              <SoftTypography
                variant="body2"
                color="info"
                sx={{ cursor: "pointer", mt: 1, textDecoration: "underline" }}
                onClick={handleClearSearch}
              >
                Réinitialiser la recherche
              </SoftTypography>
            )}
          </SoftBox>
        )}
      </SoftBox>
    </SoftBox>
  );
}

export default ListPatientData;