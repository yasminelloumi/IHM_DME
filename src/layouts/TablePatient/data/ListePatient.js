import { useState } from "react";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
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
  QrCodeScanner,
} from "@mui/icons-material";
import QRCodeScanner from "./QRCodeScanner"; // <-- make sure the path is correct

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

      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open}>
          <SoftBox sx={modalStyle}>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <SoftTypography variant="h5" fontWeight="bold">
                Détails du Patient
              </SoftTypography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </SoftBox>
            <Divider sx={{ mb: 2 }} />
            <SoftBox display="flex" flexDirection="column" gap={2}>
              <DetailItemModal icon={<Person />} label="CIN" value={cin} />
              <DetailItemModal icon={<Phone />} label="Téléphone" value={telephone} />
              <DetailItemModal icon={<Cake />} label="Date de Naissance" value={dateNaissance} />
              <DetailItemModal icon={<Public />} label="Nationalité" value={nationalite} />
            </SoftBox>
          </SoftBox>
        </Fade>
      </Modal>
    </>
  );
}

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

PatientCard.propTypes = {
  cin: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  prenom: PropTypes.string.isRequired,
  telephone: PropTypes.string.isRequired,
  dateNaissance: PropTypes.string.isRequired,
  nationalite: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

DetailItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

DetailItemModal.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

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
  const [scannerOpen, setScannerOpen] = useState(false);

  const filteredPatients = patients.filter(
    (p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.prenom.toLowerCase().includes(search.toLowerCase()) ||
      p.cin.toLowerCase().includes(search.toLowerCase())
  );

  const handleClearSearch = () => setSearch("");

  const handleScanSuccess = (cin) => {
    setSearch(cin);
    setScannerOpen(false);
  };

  const handleScanError = (err) => {
    console.error("QR Scan Error:", err);
  };

  return (
    <SoftBox width="100%" maxWidth="1200px" mx="auto" p={3}>
      <SoftTypography variant="h4" mb={2} fontWeight="bold">
        Liste des Patients
      </SoftTypography>

      <SoftBox mb={3} display="flex" flexDirection="column" gap={2}>
        <SoftBox display="flex" alignItems="center" gap={2}>
          <SoftButton
            variant="gradient"
            color="info"
            onClick={() => setScannerOpen(!scannerOpen)}
            startIcon={<QrCodeScanner />}
            sx={{ borderRadius: "12px", px: 3 }}
          >
            {scannerOpen ? "Fermer le Scanner" : "Scanner un QR Code"}
          </SoftButton>
        </SoftBox>

        {scannerOpen && (
          <SoftBox
            sx={{
              borderRadius: "16px",
              backgroundColor: "#fff",
              p: 2,
              border: "2px solid #0077b6",
              maxWidth: "400px",
              mx: "auto",
            }}
          >
            <QRCodeScanner onScanSuccess={handleScanSuccess} onError={handleScanError} />
          </SoftBox>
        )}
      </SoftBox>

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
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </SoftBox>

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
