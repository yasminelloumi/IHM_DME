import { useState } from "react";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import curved9 from "assets/images/curved-images/curved-6.jpg";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);
  const [userType, setUserType] = useState("patient");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleSignIn = () => {
    if (userType === "staff") {
      console.log("Logging in medical staff with matricule:", identifier);
    } else {
      console.log("Logging in patient with CIN:", identifier);
    }
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
        position: "relative",
        overflow: "hidden",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        {/* Sliding Toggle */}
        <SoftBox 
          sx={{ 
            display: "flex",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px 8px 0 0"
          }}
        >
          <SoftButton
            variant={userType === "patient" ? "gradient" : "text"}
            color="info"
            sx={{ 
              flex: 1,
              borderRadius: "8px 0 0 0",
              transition: "all 0.3s ease",
              background: userType === "patient" 
                ? "linear-gradient(45deg, #2196F3, #21CBF3)"
                : "transparent",
              color: userType === "patient" ? "white" : "gray",
              "&:hover": {
                background: userType === "patient" 
                  ? "linear-gradient(45deg, #2196F3, #21CBF3)"
                  : "#f0f0f0"
              }
            }}
            onClick={() => setUserType("patient")}
          >
            Patient
          </SoftButton>
          <SoftButton
            variant={userType === "staff" ? "gradient" : "text"}
            color="info"
            sx={{ 
              flex: 1,
              borderRadius: "0 8px 0 0",
              transition: "all 0.3s ease",
              background: userType === "staff" 
                ? "linear-gradient(45deg, #2196F3, #21CBF3)"
                : "transparent",
              color: userType === "staff" ? "white" : "gray",
              "&:hover": {
                background: userType === "staff" 
                  ? "linear-gradient(45deg, #2196F3, #21CBF3)"
                  : "#f0f0f0"
              }
            }}
            onClick={() => setUserType("staff")}
          >
            Medical Staff
          </SoftButton>
        </SoftBox>

        {/* Sliding Form Content */}
        <SoftBox
          component="form"
          role="form"
          sx={{
            padding: 3,
            backgroundColor: "white",
            animation: "slideIn 0.3s ease-in-out",
            "@keyframes slideIn": {
              from: { transform: "translateX(20px)", opacity: 0 },
              to: { transform: "translateX(0)", opacity: 1 }
            }
          }}
        >
          <SoftBox mb={2}>
            <SoftTypography 
              component="label" 
              variant="caption" 
              fontWeight="bold"
              sx={{ display: "block", mb: 1 }}
            >
              {userType === "staff" ? "Matricule" : "CIN"}
            </SoftTypography>
            <SoftInput
              type="text"
              placeholder={userType === "staff" ? "Enter your Matricule" : "Enter your CIN"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              sx={{
                transition: "all 0.3s ease",
                "&:focus": {
                  borderColor: "#2196F3",
                  boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.2)"
                }
              }}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography 
              component="label" 
              variant="caption" 
              fontWeight="bold"
              sx={{ display: "block", mb: 1 }}
            >
              Password
            </SoftTypography>
            <SoftInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                transition: "all 0.3s ease",
                "&:focus": {
                  borderColor: "#2196F3",
                  boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.2)"
                }
              }}
            />
          </SoftBox>

          <SoftBox display="flex" alignItems="center" mb={3}>
            <Switch checked={rememberMe} onChange={handleSetRememberMe} />
            <SoftTypography 
              variant="button" 
              onClick={handleSetRememberMe} 
              sx={{ 
                cursor: "pointer", 
                userSelect: "none",
                ml: 1 
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
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)"
              }
            }}
          >
            Sign in
          </SoftButton>

          {userType === "patient" && (
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Don&apos;t have an account?{" "}
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      opacity: 0.8
                    }
                  }}
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