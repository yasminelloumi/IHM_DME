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
import brand from "assets/images/logo3.png";

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

  const [success, setSuccess] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    const requiredFields = ["CIN", "nom", "prenom", "tel", "dateNaissance", "nationalite", "password"];
    const emptyFields = requiredFields.filter((field) => !patient[field]?.trim());
  
    if (emptyFields.length > 0) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }
  
    try {
      const { data: existingPatients } = await axios.get(`http://localhost:3001/patients?CIN=${patient.CIN}`);
      
      if (existingPatients.length > 0) {
        setError("CIN already exists. Please use a different one.");
        setLoading(false);
        return;
      }
  
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
      icon: <FingerprintIcon sx={{ color: '#0288d1' }} />,
      type: "text",
      helperText: "CIN *",
      placeholder: "12345678"
    },
    { 
      name: "prenom",
      label: "First Name", 
      icon: <PersonIcon sx={{ color: '#0288d1' }} />,
      type: "text",
      helperText: "First Name *",
      placeholder: "John"
    },
    { 
      name: "nom",
      label: "Last Name", 
      icon: <PersonIcon sx={{ color: '#0288d1' }} />,
      type: "text",
      helperText: "Last Name *",
      placeholder: "Doe"
    },
    { 
      name: "tel",
      label: "Phone", 
      icon: <PhoneIcon sx={{ color: '#0288d1' }} />,
      type: "tel",
      helperText: "Phone *",
      placeholder: "+216 12345678"
    },
    { 
      name: "dateNaissance",
      label: "Date of Birth", 
      icon: <CakeIcon sx={{ color: '#0288d1' }} />,
      type: "date",
      InputLabelProps: { shrink: true },
      helperText: "Date of Birth *",
      placeholder: "YYYY-MM-DD"
    },
    { 
      name: "nationalite",
      label: "Nationality", 
      icon: <PublicIcon sx={{ color: '#0288d1' }} />,
      type: "text",
      helperText: "Nationality *",
      placeholder: "Tunisian"
    },
    { 
      name: "password", 
      label: "Password", 
      icon: <LockIcon sx={{ color: '#0288d1' }} />,
      type: showPassword ? "text" : "password",
      helperText: "Password *",
      placeholder: "********",
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
          >
            {showPassword ? <VisibilityOff sx={{ color: '#0288d1' }} /> : <Visibility sx={{ color: '#0288d1' }} />}
          </IconButton>
        </InputAdornment>
      )
    }
  ];

  return (
    <Box sx={{
      ...signInStyles.pageContainer,
      backgroundImage: `url(${medicalBg})`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${medicalBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }
    }}>
      <Box sx={signInStyles.formContainer}>
        <Box sx={signInStyles.header}>
          <Box 
            component="img" 
            src={brand} 
            alt="Logo" 
            sx={{ 
              height: '60px',
              mb: 2 
            }} 
          />
          <SoftTypography variant="h1" fontWeight="bold" gutterBottom>
            Electronic Medical Record
          </SoftTypography>
        
          <SoftTypography variant="body1" color="text.secondary">
            Join our medical platform
          </SoftTypography>
        </Box>

        <Box component="form" onSubmit={handleSignUp} sx={signInStyles.formContent}>
          {fieldConfig.map((field) => (
            <SoftBox sx={signInStyles.inputField} key={field.name}>
              <SoftBox display="flex" alignItems="center" mb={1}>
                {field.icon}
                <SoftTypography variant="body2" color="text.secondary" ml={1}>
                  {field.helperText}
                </SoftTypography>
              </SoftBox>
              <SoftInput
                fullWidth
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
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
                required
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
            sx={{
              ...signInStyles.submitButton,
              color: '#ffffff'
            }}
            startIcon={!loading && <HowToRegIcon sx={{ color: '#ffffff' }} />}
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