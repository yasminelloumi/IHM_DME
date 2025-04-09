import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import curved6 from "assets/images/curved-images/curved14.jpg";
import QRCode from "react-qr-code";

function SignUp() {
  const qrRef = useRef();
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
    qrCode: "",
  });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      // Generate QR code data
      const qrValue = JSON.stringify({
        CIN: patient.CIN,
        nom: patient.nom,
        prenom: patient.prenom,
        tel: patient.tel,
        dateNaissance: patient.dateNaissance,
        nationalite: patient.nationalite,
      });

      // Wait for QR code to render and convert to PNG
      const dataUrl = await toPng(qrRef.current);
      const patientWithQR = {
        ...patient,
        qrCode: dataUrl,
      };

      // Send to JSON Server
      const response = await axios.post("http://localhost:3001/Patient", patientWithQR);

      if (response.status >= 200 && response.status < 300) {
        alert("Patient registered and QR saved successfully!");
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
        throw new Error(`Failed to register patient: ${response.statusText}`);
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

  // Field labels for better placeholder text
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
            <QRCode
              value={JSON.stringify({
                CIN: patient.CIN,
                nom: patient.nom,
                prenom: patient.prenom,
                tel: patient.tel,
                dateNaissance: patient.dateNaissance,
                nationalite: patient.nationalite,
              })}
              size={128}
            />
          </div>
        </div>

        {error && (
          <SoftBox mt={3} textAlign="center">
            <SoftTypography variant="body2" color="error">
              {error}
            </SoftTypography>
          </SoftBox>
        )}

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