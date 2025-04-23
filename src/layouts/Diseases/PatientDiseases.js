import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Collapse,
  Stack,
  Modal,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Box,
  Pagination,
  IconButton,
} from "@mui/material";
import {
  Description,
  Vaccines,
  CalendarMonth,
  MonitorHeart,
  HealthAndSafety,
  LocalHospital,
  ReportProblem,
  WarningAmber,
  CheckCircle,
  SignalCellularAlt,
  Add as AddIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { getConditionsByPatientId, createCondition } from "services/conditionService";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const renderSeverityBadge = (severity) => {
  const badgeProps = {
    Mild: { color: "success", icon: <CheckCircle sx={{ fontSize: 16, mr: 0.5 }} /> },
    Moderate: { color: "warning", icon: <WarningAmber sx={{ fontSize: 16, mr: 0.5 }} /> },
    Severe: { color: "error", icon: <ReportProblem sx={{ fontSize: 16, mr: 0.5 }} /> },
    Controlled: { color: "info", icon: <CheckCircle sx={{ fontSize: 16, mr: 0.5 }} /> },
    "Stage 1": { color: "primary", icon: <SignalCellularAlt sx={{ fontSize: 16, mr: 0.5 }} /> },
  };

  const badge = badgeProps[severity];
  return badge && (
    <SoftBadge
      color={badge.color}
      size="sm"
      icon={badge.icon}
      badgeContent={severity}
    />
  );
};

const DiseaseItem = ({ disease }) => (
  <Card sx={{
    mb: 3,
    p: 3,
    borderRadius: 3,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    background: "#fff",
    transition: "all 0.3s ease",
  }}>
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <SoftTypography variant="h6" fontWeight="bold" color="dark">
          {disease.name}
        </SoftTypography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CalendarMonth sx={{ fontSize: 18, color: "text.secondary" }} />
          <SoftTypography variant="caption" color="text.secondary">
            {disease.diagnosisDate || "Unknown date"}
          </SoftTypography>
        </Stack>
      </Stack>

      {renderSeverityBadge(disease.severity)}

      <Stack direction="row" spacing={1} alignItems="center">
        <Description sx={{ fontSize: 20, color: "#0077b6" }} />
        <SoftTypography variant="button" fontWeight="bold" color="dark">
          Description:
        </SoftTypography>
      </Stack>
      <SoftTypography variant="body2" color="text">
        {disease.description || "No description available."}
      </SoftTypography>

      <Stack direction="row" spacing={1} alignItems="center" mt={1}>
        <Vaccines sx={{ fontSize: 20, color: "#388e3c" }} />
        <SoftTypography variant="button" fontWeight="bold" color="dark">
          Treatment:
        </SoftTypography>
      </Stack>
      <SoftTypography variant="body2" color="text">
        {disease.treatment || "No treatment specified."}
      </SoftTypography>
    </Stack>
  </Card>
);

DiseaseItem.propTypes = {
  disease: PropTypes.object.isRequired,
};

const DiseaseCategory = ({ category, onAddDisease }) => {
  const [expanded, setExpanded] = useState(true);
  const connectedUser = JSON.parse(localStorage.getItem("connectedUser")) || {};
  const isMedecin = connectedUser.role === "medecins";

  const categoryIcons = {
    Chronic: <MonitorHeart sx={{ fontSize: 24, color: "#1976d2" }} />,
    Allergy: <HealthAndSafety sx={{ fontSize: 24, color: "#1976d2" }} />,
    Infectious: <LocalHospital sx={{ fontSize: 24, color: "#1976d2" }} />,
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        onClick={() => setExpanded(!expanded)}
        sx={{ cursor: "pointer" }}
      >
        <SoftBox display="flex" alignItems="center" gap={1}>
          {categoryIcons[category.name]}
          <SoftTypography variant="h5" fontWeight="medium">
            {category.name} ({category.items.length})
          </SoftTypography>
        </SoftBox>
        
        <Stack direction="row" alignItems="center" spacing={1}>
          {isMedecin && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onAddDisease(category.name.toLowerCase());
              }}
              sx={{ 
                color: "white",
                backgroundColor: "primary.main",
                '&:hover': {
                  backgroundColor: "primary.dark",
                }
              }}
              size="small"
            >
              <AddIcon />
            </IconButton>
          )}
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </Stack>
      </SoftBox>

      <Collapse in={expanded}>
        <SoftBox p={2}>
          {category.items.map((disease, index) => (
            <DiseaseItem key={index} disease={disease} />
          ))}
        </SoftBox>
      </Collapse>
    </Card>
  );
};

DiseaseCategory.propTypes = {
  category: PropTypes.object.isRequired,
  onAddDisease: PropTypes.func.isRequired,
};

const PatientDiseases = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newDisease, setNewDisease] = useState({
    type: "",
    name: "",
    diagnosisDate: "",
    severity: "",
    description: "",
    treatment: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1; // 1 catégorie par page

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("connectedUser"));

        if (!user) {
          console.error("No connected user found.");
          return;
        }

        let patientId = null;
        let scannedPatient = null;

        if (user.role === "patient") {
          patientId = user.id;
        } else if (
          ["medecins", "laboratoire", "centreImagerie"].includes(user.role)
        ) {
          scannedPatient = JSON.parse(localStorage.getItem("scannedPatient"));
          if (!scannedPatient) {
            console.error("No scanned patient found for medecin/lab/imagerie.");
            return;
          }
          patientId = scannedPatient.id;
        }

        if (!patientId) {
          console.error("No patient ID found.");
          return;
        }

        const conditions = await getConditionsByPatientId(patientId);

        const grouped = {
          Allergy: [],
          Chronic: [],
          Infectious: [],
        };

        conditions.forEach((condition) => {
          const type = condition.type?.toLowerCase();
          if (type === "allergy") grouped.Allergy.push(condition);
          else if (type === "chronic") grouped.Chronic.push(condition);
          else if (type === "infectious") grouped.Infectious.push(condition);
        });

        // Filtrer les catégories vides
        const categorized = Object.keys(grouped)
          .filter(key => grouped[key].length > 0)
          .map(key => ({
            name: key,
            items: grouped[key],
          }));

        setCategories(categorized);
      } catch (error) {
        console.error("Error loading conditions:", error);
      }
    };

    fetchConditions();
  }, []);

  // Obtenir la catégorie actuelle à afficher
  const currentCategory = categories[currentPage] || null;
  const totalPages = categories.length;

  const handleOpenModal = (type) => {
    setNewDisease({
      type: type,
      name: "",
      diagnosisDate: "",
      severity: "",
      description: "",
      treatment: "",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDisease((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("connectedUser"));
      let patientId = null;

      if (user.role === "patient") {
        patientId = user.id;
      } else {
        const scannedPatient = JSON.parse(localStorage.getItem("scannedPatient"));
        if (!scannedPatient) {
          console.error("No scanned patient found");
          return;
        }
        patientId = scannedPatient.id;
      }

      const diseaseToCreate = {
        ...newDisease,
        patientId: patientId,
      };

      const createdDisease = await createCondition(diseaseToCreate);

      setCategories((prevCategories) => {
        return prevCategories.map((category) => {
          if (category.name.toLowerCase() === newDisease.type.toLowerCase()) {
            return {
              ...category,
              items: [...category.items, createdDisease],
            };
          }
          return category;
        });
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error creating condition:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1); // Pagination commence à 1, notre état commence à 0
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox
        py={3}
        px={2}
        sx={{
          background: "linear-gradient(135deg, #e6f0fa 0%, #b3cde0 100%)",
          minHeight: "100vh",
        }}
      >
        <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          p={3}
          sx={{
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SoftTypography variant="h3" fontWeight="bold" color="dark">
            Medical Conditions
          </SoftTypography>
        </SoftBox>

        <SoftBox>
          {totalPages === 0 ? (
            <SoftTypography variant="h6" color="text" textAlign="center" mt={5}>
              You have no recorded medical conditions at the moment.
            </SoftTypography>
          ) : currentCategory ? (
            <DiseaseCategory
              category={currentCategory}
              onAddDisease={handleOpenModal}
            />
          ) : null}
        </SoftBox>

        {totalPages > 1 && (
          <SoftBox 
            display="flex" 
            justifyContent="center" 
            mt={4}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#1976d2',
                '&.Mui-selected': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                }
              }
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage + 1} // Pagination commence à 1
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </SoftBox>
        )}

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="add-disease-modal"
          aria-describedby="add-new-disease"
        >
          <Box sx={modalStyle}>
            <SoftTypography variant="h6" mb={3}>
              Add New {newDisease.type.charAt(0).toUpperCase() + newDisease.type.slice(1)} Condition
            </SoftTypography>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Condition Name"
                name="name"
                value={newDisease.name}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="Diagnosis Date"
                type="date"
                name="diagnosisDate"
                value={newDisease.diagnosisDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth>
                <InputLabel id="severity-label">Severity</InputLabel>
                <Box
                  component="select"
                  name="severity"
                  value={newDisease.severity || ""}
                  onChange={handleInputChange}
                  sx={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: "white",
                    marginTop: "16px",
                    height: "40px",
                  }}
                >
                  <option value="" disabled>Select Severity</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Controlled">Controlled</option>
                  <option value="Stage 1">Stage 1</option>
                </Box>
              </FormControl>
              
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newDisease.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />

              <TextField
                fullWidth
                label="Treatment"
                name="treatment"
                value={newDisease.treatment}
                onChange={handleInputChange}
                multiline
                rows={2}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button variant="outlined" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Save
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default PatientDiseases;