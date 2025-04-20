import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Switch,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
// Corrigez les imports des icônes comme ceci :
import {
  MedicalServices as MedicalServicesIcon,
  Badge as BadgeIcon,
  Lock as LockIcon, // Icône de cadenas pour le mot de passe
  Person as PersonIcon, // Icône de personne
  Groups as GroupsIcon, // Icône de groupe
  Visibility, // Icône œil ouvert
  VisibilityOff, // Icône œil barré
  ErrorOutline as ErrorOutlineIcon
} from '@mui/icons-material'; // Cette ligne importe toutes les icônes nécessaires
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { authenticatePatient, authenticateStaff } from "services/authService";
import medicalBg from "../../../assets/images/medical-bg.jpg";
import { signInStyles } from "./medicalTheme";

// ... (le reste de votre code reste inchangé)

function SignIn() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);
  const [userType, setUserType] = useState("patient");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!identifier || !password) {
        throw new Error("Please fill in all fields");
      }

      let user = null;
      let authFunction = userType === "patient" ? authenticatePatient : authenticateStaff;
      user = await authFunction(identifier, password);

      if (!user) {
        throw new Error("Invalid credentials.");
      }

      // Store user data in localStorage
      localStorage.setItem("connectedUser", JSON.stringify({
        ...user,
        type: userType,
        rememberMe
      }));

      // Redirect based on role with page refresh
      const redirectPath = getRedirectPath(userType, user.role);
      window.location.href = redirectPath; // Full page refresh to ensure routes update

    } catch (err) {
      setError(err.message || "Failed to authenticate. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRedirectPath = (userType, role) => {
    if (userType === "patient") return "/dashboard";
    
    switch(role) {
      case "medecins":
        return "/TablePatient";
      case "laboratoire":
        return "/ScanQRCode";
      case "centreImagerie":
        return "/ScanQRCode";
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setIdentifier("");
    setPassword("");
    setError(null);
  };

  return (
    <Box sx={{
      ...signInStyles.pageContainer,
      backgroundImage: `url(${medicalBg})`
    }}>
      <Box sx={signInStyles.formContainer}>
        <Box sx={signInStyles.header}>
          <MedicalServicesIcon sx={{ ...signInStyles.icon.primary, fontSize: 40 }} />
          <SoftTypography variant="h1" color="primary" fontWeight="bold" gutterBottom>
            Welcome Back
          </SoftTypography>
          <SoftTypography variant="body1" color="text.secondary">
            Access your medical portal
          </SoftTypography>
        </Box>

        <Box sx={signInStyles.toggleContainer}>
          <SoftButton
            sx={signInStyles.toggleButton(userType === "patient")}
            onClick={() => setUserType("patient")}
            startIcon={<PersonIcon sx={signInStyles.icon.primary} />}
          >
            Patient
          </SoftButton>
          <SoftButton
            sx={signInStyles.toggleButton(userType === "staff")}
            onClick={() => setUserType("staff")}
            startIcon={<GroupsIcon sx={signInStyles.icon.primary} />}
          >
            Medical Staff
          </SoftButton>
        </Box>

        <Box component="form" onSubmit={handleSignIn} sx={signInStyles.formContent}>
          <SoftBox sx={signInStyles.inputField}>
            <SoftInput
              fullWidth
              autoFocus
              label={userType === "staff" ? "Matricule" : "CIN"}
              placeholder={`Enter your ${userType === "staff" ? "matricule" : "CIN"}`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </SoftBox>

          <SoftBox sx={signInStyles.inputField}>
            <SoftInput
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </SoftBox>

          <Box sx={signInStyles.rememberMe}>
            <Switch
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              color="primary"
            />
            <SoftTypography variant="body2" color="text.secondary">
              Remember me
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
            disabled={loading || !identifier || !password}
            sx={{
              ...signInStyles.submitButton,
              backgroundColor: 'white',
              color: '#1976d2',
              border: '1px solid #1976d2',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#1565c0',
                borderColor: '#1565c0'
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e',
                borderColor: '#bdbdbd'
              }
            }}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <MedicalServicesIcon sx={{ color: '#1976d2' }} />
              )
            }
          >
            {loading ? "Signing In..." : "Sign In"}
          </SoftButton>
        </Box>

        {userType === "patient" && (
          <Box sx={signInStyles.footer}>
            <SoftTypography variant="body2">
              Don't have an account?{" "}
              <Link to="/authentication/sign-up" style={signInStyles.footerLink}>
                Sign up
              </Link>
            </SoftTypography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default SignIn;