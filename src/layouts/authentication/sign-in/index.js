import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { authenticatePatient, authenticateStaff } from "services/authService";
import curved9 from "assets/images/curved-images/curved-6.jpg";

function SignIn() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);
  const [userType, setUserType] = useState("patient");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!identifier || !password) {
        throw new Error("Please fill in all fields.");
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
        return "/dashboard";
      case "laboratoire":
        return "/laboratory";
      case "centreImagerie":
        return "/ListPatientData";
      default:
        return "/ListPatientData";
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setIdentifier("");
    setPassword("");
    setError(null);
  };

  return (
    <CoverLayout
      title="Welcome back"
      description="Access your medical portal"
      image={curved9}
    >
      <SoftBox sx={{ 
        width: "100%", 
        maxWidth: "400px", 
        borderRadius: "8px", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        {/* User Type Toggle */}
        <SoftBox sx={{ 
          display: "flex", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px 8px 0 0"
        }}>
          <SoftButton
            variant={userType === "patient" ? "contained" : "text"}
            color="info"
            sx={{
              flex: 1,
              borderRadius: 0,
              py: 1.5,
              backgroundColor: userType === "patient" ? "#1976d2" : "transparent",
              color: userType === "patient" ? "white" : "text.secondary",
              "&:hover": {
                backgroundColor: userType === "patient" ? "#1565c0" : "rgba(0,0,0,0.04)",
              }
            }}
            onClick={() => handleUserTypeChange("patient")}
            disabled={loading}
          >
            Patient
          </SoftButton>
          <SoftButton
            variant={userType === "staff" ? "contained" : "text"}
            color="info"
            sx={{
              flex: 1,
              borderRadius: 0,
              py: 1.5,
              backgroundColor: userType === "staff" ? "#1976d2" : "transparent",
              color: userType === "staff" ? "white" : "text.secondary",
              "&:hover": {
                backgroundColor: userType === "staff" ? "#1565c0" : "rgba(0,0,0,0.04)",
              }
            }}
            onClick={() => handleUserTypeChange("staff")}
            disabled={loading}
          >
            Medical Staff
          </SoftButton>
        </SoftBox>

        {/* Form Content */}
        <SoftBox component="form" role="form" sx={{ 
          padding: 3, 
          backgroundColor: "white",
          "& .Mui-focused": {
            color: "text.primary",
          }
        }}>
          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" display="block" mb={1}>
              {userType === "staff" ? "Matricule" : "CIN"}
            </SoftTypography>
            <SoftInput
              type="text"
              placeholder={userType === "staff" ? "Enter your matricule" : "Enter your CIN"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              fullWidth
              disabled={loading}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography variant="caption" fontWeight="bold" display="block" mb={1}>
              Password
            </SoftTypography>
            <SoftInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              disabled={loading}
            />
          </SoftBox>

          <SoftBox display="flex" alignItems="center" mb={3}>
            <Switch 
              checked={rememberMe} 
              onChange={handleSetRememberMe}
              color="info"
              disabled={loading}
            />
            <SoftTypography 
              variant="button" 
              onClick={handleSetRememberMe} 
              sx={{ 
                cursor: "pointer", 
                userSelect: "none", 
                ml: 1,
                color: "text.secondary"
              }}
            >
              Remember me
            </SoftTypography>
          </SoftBox>

          <SoftButton 
            variant="gradient" 
            color="info" 
            fullWidth 
            onClick={handleSignIn}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? "Signing In..." : "Sign in"}
          </SoftButton>

          {error && (
            <SoftBox mt={2} textAlign="center">
              <SoftTypography variant="caption" color="error">
                {error}
              </SoftTypography>
            </SoftBox>
          )}

          {userType === "patient" && (
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text.secondary" fontWeight="regular">
                Dont have an account?{" "}
                <SoftTypography 
                  component={Link} 
                  to="/authentication/sign-up" 
                  variant="button" 
                  color="info" 
                  fontWeight="bold"
                  sx={{ textDecoration: "underline" }}
                >
                  Sign up
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;