import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import curved6 from "assets/images/curved-images/curved14.jpg";
import QRCode from "react-qr-code";

// Import the registerPatient function from registerService.js
import { registerPatient } from "../../../services/registerService";

function SignUp() {
  const qrRef = useRef(); // Ref to capture QR code as an image
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState({
    CIN: "",
    nom: "",
    prenom: "",
    tel: "",
    dateNaissance: "",
    nationalite: "",
    password: "",
    qrCode: "", // To store the QR code image or URL
  });

  const navigate = useNavigate();

  // Handle changes in input fields
  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  // Handle form submission and patient registration
  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      // Add role as 'patient' before registering
      const patientWithRole = { ...patient, role: "patient" };

      // Use the registerPatient function from registerService
      const response = await registerPatient(patientWithRole); // register patient and get response with qr code

      if (response) {
        alert("Patient registered and QR saved successfully!");

        // Reset patient data and redirect to sign-in page
        setPatient({
          CIN: "",
          nom: "",
          prenom: "",
          tel: "",
          dateNaissance: "",
          nationalite: "",
          password: "",
          qrCode: "",
        });
        navigate("/authentication/sign-in"); // Redirect to login page
      } else {
        throw new Error("Patient registration failed.");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred during registration.";
      setError(errorMessage);
      console.error("Error during signup:", err);
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Field labels for placeholders (without email)
  const fieldLabels = {
    CIN: "CIN",
    nom: "Last Name",
    prenom: "First Name",
    tel: "Phone",
    dateNaissance: "Date of Birth",
    nationalite: "Nationality",
    password: "Password",
  };

  return (
    <BasicLayout
      title="Register as Patient"
      description="Please fill the form below"
      image={curved6}
    >
      <SoftBox component="form" role="form" p={3}>
        {/* Render input fields dynamically */}
        {Object.keys(fieldLabels).map((field) => (
          <SoftBox mb={2} key={field}>
            <SoftInput
              type={field === "password" ? "password" : field === "dateNaissance" ? "date" : "text"}
              name={field}
              placeholder={fieldLabels[field]}
              onChange={handleChange}
              value={patient[field]}
            />
          </SoftBox>
        ))}

        {/* Submit button */}
        <SoftBox mt={4} mb={1}>
          <SoftButton
            variant="gradient"
            color="dark"
            fullWidth
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </SoftButton>
        </SoftBox>

        {/* Hidden QR code for image generation */}
        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
          <div ref={qrRef}>
            <QRCode value={`http://localhost:3000/dme/${patient.CIN}`} size={128} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <SoftBox mt={3} textAlign="center">
            <SoftTypography variant="body2" color="error">
              {error}
            </SoftTypography>
          </SoftBox>
        )}

        {/* Redirect to sign-in page if user already has an account */}
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Already have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-in"
              variant="button"
              color="dark"
              fontWeight="bold"
              textGradient
            >
              Sign in
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </BasicLayout>
  );
}

export default SignUp;
