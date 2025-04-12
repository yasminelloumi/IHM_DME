import React from 'react';
import PropTypes from 'prop-types';
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import {
  Event as EventIcon,
  MedicalServices as MedicalServicesIcon,
  LocalHospital as LocalHospitalIcon,
  Science as ScienceIcon,
  InsertPhoto as InsertPhotoIcon
} from '@mui/icons-material';

// Demo data for consultations
const consultationsData = [
  {
    id: 1,
    date: "June 15, 2023",
    time: "10:30 AM",
    doctor: "Dr. Smith",
    specialty: "Cardiologist",
    reason: "Chest pain evaluation",
    diagnosis: "Hypertension (Stage 1)",
    treatments: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily" },
      { name: "Blood pressure monitoring", frequency: "Twice daily" }
    ],
    tests: ["ECG", "Complete blood count", "Cholesterol panel"],
    images: ["Chest X-ray"],
    notes: "Patient advised to reduce sodium intake and exercise regularly."
  },
  {
    id: 2,
    date: "May 10, 2023",
    time: "2:15 PM",
    doctor: "Dr. Johnson",
    specialty: "General Practitioner",
    reason: "Annual physical examination",
    diagnosis: "Normal health status",
    treatments: [],
    tests: ["Complete blood count", "Urinalysis"],
    images: [],
    notes: "All results within normal range. Recommended follow-up in one year."
  }
];

const TreatmentItem = ({ treatment }) => (
  <SoftBox display="flex" alignItems="center" mb={1}>
    <MedicalServicesIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
    <SoftTypography variant="body2">
      {treatment.name} - {treatment.dosage} ({treatment.frequency})
    </SoftTypography>
  </SoftBox>
);

TreatmentItem.propTypes = {
  treatment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    dosage: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired
  }).isRequired
};

const TestItem = ({ test }) => (
  <SoftBox display="flex" alignItems="center" mb={1}>
    <ScienceIcon color="secondary" fontSize="small" sx={{ mr: 1 }} />
    <SoftTypography variant="body2">{test}</SoftTypography>
  </SoftBox>
);

TestItem.propTypes = {
  test: PropTypes.string.isRequired
};

const ImageItem = ({ image }) => (
  <SoftBox display="flex" alignItems="center" mb={1}>
    <InsertPhotoIcon color="info" fontSize="small" sx={{ mr: 1 }} />
    <SoftTypography variant="body2">{image}</SoftTypography>
  </SoftBox>
);

ImageItem.propTypes = {
  image: PropTypes.string.isRequired
};

const ConsultationCard = ({ consultation }) => {
  return (
    <Card sx={{ 
      mb: 3, 
      p: 3,
      borderRadius: '12px',
      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <SoftTypography variant="h5" fontWeight="bold" color="primary">
          <EventIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          {consultation.date} at {consultation.time}
        </SoftTypography>
        <SoftBox bgcolor="lightPrimary.main" p={1} borderRadius="md">
          <SoftTypography variant="button" fontWeight="medium">
            {consultation.specialty}
          </SoftTypography>
        </SoftBox>
      </SoftBox>

      <SoftBox mb={3}>
        <SoftTypography variant="h6" fontWeight="bold" gutterBottom>
          <LocalHospitalIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Consultation with {consultation.doctor}
        </SoftTypography>
      </SoftBox>

      <SoftBox mb={3}>
        <SoftTypography variant="button" fontWeight="bold" gutterBottom>
          Reason for Visit
        </SoftTypography>
        <SoftTypography variant="body2" paragraph>
          {consultation.reason}
        </SoftTypography>
      </SoftBox>

      <SoftBox mb={3}>
        <SoftTypography variant="button" fontWeight="bold" gutterBottom>
          Diagnosis
        </SoftTypography>
        <SoftTypography variant="body2" paragraph>
          {consultation.diagnosis}
        </SoftTypography>
      </SoftBox>

      {consultation.treatments.length > 0 && (
        <SoftBox mb={3}>
          <SoftTypography variant="button" fontWeight="bold" gutterBottom>
            Prescribed Treatments
          </SoftTypography>
          {consultation.treatments.map((treatment, index) => (
            <TreatmentItem key={index} treatment={treatment} />
          ))}
        </SoftBox>
      )}

      {(consultation.tests.length > 0 || consultation.images.length > 0) && (
        <SoftBox mb={3}>
          <SoftTypography variant="button" fontWeight="bold" gutterBottom>
            Requested Exams
          </SoftTypography>
          
          {consultation.tests.length > 0 && (
            <SoftBox mb={2}>
              <SoftTypography variant="caption" fontWeight="bold" display="block" gutterBottom>
                LABORATORY TESTS
              </SoftTypography>
              {consultation.tests.map((test, index) => (
                <TestItem key={`test-${index}`} test={test} />
              ))}
            </SoftBox>
          )}

          {consultation.images.length > 0 && (
            <SoftBox>
              <SoftTypography variant="caption" fontWeight="bold" display="block" gutterBottom>
                IMAGING STUDIES
              </SoftTypography>
              {consultation.images.map((image, index) => (
                <ImageItem key={`image-${index}`} image={image} />
              ))}
            </SoftBox>
          )}
        </SoftBox>
      )}

      {consultation.notes && (
        <SoftBox mt={3} p={2} bgcolor="lightSecondary.main" borderRadius="md">
          <SoftTypography variant="button" fontWeight="bold" gutterBottom>
            Doctor&apos;s Notes
          </SoftTypography>
          <SoftTypography variant="body2">
            {consultation.notes}
          </SoftTypography>
        </SoftBox>
      )}
    </Card>
  );
};

ConsultationCard.propTypes = {
  consultation: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    doctor: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    diagnosis: PropTypes.string.isRequired,
    treatments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        dosage: PropTypes.string.isRequired,
        frequency: PropTypes.string.isRequired
      })
    ).isRequired,
    tests: PropTypes.arrayOf(PropTypes.string).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    notes: PropTypes.string
  }).isRequired
};

const PatientConsultations = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={4}>
          <SoftTypography variant="h2" fontWeight="bold" gutterBottom>
            My Medical Consultations
          </SoftTypography>
          <SoftTypography variant="body1" color="text" paragraph>
            Review your complete consultation history with detailed visit information.
          </SoftTypography>
        </SoftBox>

        {consultationsData.map((consultation) => (
          <ConsultationCard key={consultation.id} consultation={consultation} />
        ))}
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default PatientConsultations;