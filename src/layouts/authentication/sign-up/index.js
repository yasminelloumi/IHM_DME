import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  Box, 
  Switch, 
  InputAdornment,
  IconButton
} from "@mui/material";
import {
  Fingerprint as FingerprintIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  HowToReg as HowToRegIcon,
  Visibility,
  VisibilityOff,
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { registerPatient } from "services/registerService";
import QRCode from "react-qr-code";
import medicalBg from "../../../assets/images/medical-bg.jpg";
import { signInStyles } from "../sign-in/medicalTheme";

function SignUp() {
  const qrRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const [success, setSuccess] = useState(null); // Add this line to your state

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    const requiredFields = ["CIN", "nom", "prenom", "tel", "dateNaissance", "nationalite", "password"];
    const emptyFields = requiredFields.filter((field) => !patient[field]?.trim());
  
    if (emptyFields.length > 0) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
  
    try {
      // Step 1: Check if CIN already exists in db.json
      const { data: existingPatients } = await axios.get(`http://localhost:3001/patients?CIN=${patient.CIN}`);
      
      if (existingPatients.length > 0) {
        setError("CIN already exists. Please use a different one.");
        setLoading(false);
        return;
      }
  
      // Step 2: Register new patient
      const patientWithRole = { ...patient, role: "patient" };
      const response = await registerPatient(patientWithRole);
  
      if (response) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/authentication/sign-in"), 2000);
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };
  const fieldConfig = [
    { 
      name: "CIN", 
      label: "National ID", 
      icon: <FingerprintIcon color="primary" />,
      type: "text"
    },
    { 
      name: "nom",  // Changed from lastName to nom
      label: "Last Name", 
      icon: <PersonIcon color="primary" />,
      type: "text"
    },
    { 
      name: "prenom", // Changed from firstName to prenom
      label: "First Name", 
      icon: <BadgeIcon color="primary" />,
      type: "text"
    },
    { 
      name: "tel", // Changed from phone to tel
      label: "Phone", 
      icon: <PhoneIcon color="primary" />,
      type: "tel"
    },
    { 
      name: "dateNaissance", // Changed from birthDate to dateNaissance
      label: "Date of Birth", 
      icon: <CakeIcon color="primary" />,
      type: "date",
      InputLabelProps: { shrink: true }
    },
    { 
      name: "nationalite", // Changed from nationality to nationalite
      label: "Nationality", 
      icon: <PublicIcon color="primary" />,
      type: "text"
    },
    { 
      name: "password", 
      label: "Password", 
      icon: <LockIcon color="primary" />,
      type: showPassword ? "text" : "password",
      helperText: "Minimum 8 characters with uppercase and number",
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      )
    }
  ];

  return (
    <Box sx={{
      ...signInStyles.pageContainer,
      backgroundImage: `url(${medicalBg})`
    }}>
      <Box sx={signInStyles.formContainer}>
        <Box sx={signInStyles.header}>
          <HowToRegIcon color="primary" sx={{ fontSize: 40 }} />
          <SoftTypography variant="h1" color="primary" fontWeight="bold" gutterBottom>
            Create Account
          </SoftTypography>
          <SoftTypography variant="body1" color="text.secondary">
            Join our medical platform
          </SoftTypography>
        </Box>

        <Box component="form" onSubmit={handleSignUp} sx={signInStyles.formContent}>
          {fieldConfig.map((field) => (
            <SoftBox sx={signInStyles.inputField} key={field.name}>
              <SoftInput
                fullWidth
                type={field.type}
                label={field.label}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                name={field.name}
                value={patient[field.name]}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {field.icon}
                    </InputAdornment>
                  ),
                  ...(field.endAdornment ? { endAdornment: field.endAdornment } : {})
                }}
                InputLabelProps={field.InputLabelProps}
                helperText={field.helperText}
              />
            </SoftBox>
          ))}

          <Box sx={signInStyles.rememberMe}>
            <Switch 
              checked={rememberMe} 
              onChange={() => setRememberMe(!rememberMe)} 
              color="primary"
            />
            <SoftTypography variant="body2" color="text.secondary">
              I agree to the terms and conditions
            </SoftTypography>
          </Box>

          {error && (
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
              <SoftTypography color="error">{error}</SoftTypography>
            </Box>
          )}

          <SoftButton 
            type="submit"
            disabled={loading || !rememberMe}
            variant="gradient"
            color="primary"
            fullWidth
            sx={signInStyles.submitButton}
            startIcon={!loading && <HowToRegIcon />}
          >
            {loading ? "Registering..." : "Register Now"}
          </SoftButton>
        </Box>

        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
          <div ref={qrRef}>
            <QRCode value={`http://localhost:3000/emr/${patient.CIN}`} size={128} />
          </div>
        </div>

        <Box sx={signInStyles.footer}>
          <SoftTypography variant="body2" color="text.secondary">
            Already have an account? {' '}
            <Link to="/authentication/sign-in" style={signInStyles.footerLink}>
              Sign In
            </Link>
          </SoftTypography>
          <SoftTypography variant="caption" color="text.secondary" mt={1}>
            © {new Date().getFullYear()} Medical Platform. All rights reserved.
          </SoftTypography>
        </Box>
      </Box>
    </Box>
  );
}
export default SignUp;
