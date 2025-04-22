import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Switch,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
import {
  Badge as BadgeIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  Visibility,
  VisibilityOff,
  ErrorOutline as ErrorOutlineIcon,
  Fingerprint as FingerprintIcon
} from '@mui/icons-material';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { authenticatePatient, authenticateStaff } from "services/authService";
import medicalBg from "../../../assets/images/medical-bg.jpg";
import { signInStyles } from "./medicalTheme";
import brand from "assets/images/logo3.png";

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

      localStorage.setItem("connectedUser", JSON.stringify({
        ...user,
        type: userType,
        rememberMe
      }));

      const redirectPath = getRedirectPath(userType, user.role);
      window.location.href = redirectPath;

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
      backgroundImage: `url(${medicalBg})`,
      backdropFilter: 'blur(8px)' // Added blur effect
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
            Access your medical portal
          </SoftTypography>
        </Box>

        <Box sx={signInStyles.toggleContainer}>
          <SoftButton
            sx={{
              ...signInStyles.toggleButton(userType === "patient"),
              backgroundColor: userType === "patient" ? '#0288d1' : '#ffffff',
              color: userType === "patient" ? '#ffffff' : '#0288d1',
              '&:hover': {
                backgroundColor: userType === "patient" ? '#0277bd' : '#f5f9ff'
              }
            }}
            onClick={() => handleUserTypeChange("patient")}
            startIcon={<PersonIcon sx={{ color: userType === "patient" ? '#ffffff' : '#0288d1' }} />}
          >
            Patient
          </SoftButton>
          <SoftButton
            sx={{
              ...signInStyles.toggleButton(userType === "staff"),
              backgroundColor: userType === "staff" ? '#0288d1' : '#ffffff',
              color: userType === "staff" ? '#ffffff' : '#0288d1',
              '&:hover': {
                backgroundColor: userType === "staff" ? '#0277bd' : '#f5f9ff'
              }
            }}
            onClick={() => handleUserTypeChange("staff")}
            startIcon={<GroupsIcon sx={{ color: userType === "staff" ? '#ffffff' : '#0288d1' }} />}
          >
            Medical Staff
          </SoftButton>
        </Box>

        <Box component="form" onSubmit={handleSignIn} sx={signInStyles.formContent}>
          <SoftBox sx={signInStyles.inputField}>
            <SoftBox display="flex" alignItems="center" mb={1}>
              <FingerprintIcon sx={{ color: '#0288d1', mr: 1 }} />
              <SoftTypography variant="body2" color="text.secondary">
                {userType === "staff" ? "Your staff ID number" : "Your CIN"}
              </SoftTypography>
            </SoftBox>
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
                    <BadgeIcon sx={{ color: '#0288d1' }} />
                  </InputAdornment>
                ),
              }}
            />
          </SoftBox>

          <SoftBox sx={signInStyles.inputField}>
            <SoftBox display="flex" alignItems="center" mb={1}>
              <LockIcon sx={{ color: '#0288d1', mr: 1 }} />
              <SoftTypography variant="body2" color="text.secondary">
                Your Password
              </SoftTypography>
            </SoftBox>
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
                    <LockIcon sx={{ color: '#0288d1' }} />
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
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#0288d1',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#0288d1',
                }
              }}
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
              color: '#ffffff' // Set text color to white
            }}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
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