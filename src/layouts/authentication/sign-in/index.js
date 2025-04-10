import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import { authenticatePatient, authenticateStaff } from "services/authService"; // Import the authentication service
import curved9 from "assets/images/curved-images/curved-6.jpg";

function SignIn() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);
  const [userType, setUserType] = useState("patient"); // Default is patient
  const [identifier, setIdentifier] = useState(""); // CIN for patient, Matricule for staff
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate input
      if (!identifier || !password) {
        throw new Error("Please fill in all fields.");
      }

      let user = null;

      // Authenticate based on userType
      if (userType === "patient") {
        const result = await authenticatePatient(identifier, password);
        user = result.length > 0 ? result[0] : null;
      } else if (userType === "staff") {
        user = await authenticateStaff(identifier, password);
      }

      if (user) {
        alert("Login successful!");

        // Redirect based on user role
        if (userType === "patient") {
          navigate("/patient/dashboard"); // Redirect to patient dashboard
        } else if (userType === "staff") {
          const role = user.role;
          if (role === "medecins") {
            navigate("/medecin/dashboard");
          } else if (role === "laboratoire") {
            navigate("/laboratoire/dashboard");
          } else if (role === "centreImagerie") {
            navigate("/centre-imagerie/dashboard");
          } else {
            navigate("/staff/dashboard");
          }
        }
      } else {
        throw new Error("Invalid credentials.");
      }
    } catch (err) {
      setError(err.message || "Failed to authenticate.");
      console.error("Error during login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setIdentifier(""); // Clear identifier when changing user type
    setPassword(""); // Clear password when changing user type
  };

  return (
    <CoverLayout
      title="Welcome back"
      description="Access your medical portal"
      image={curved9}
    >
      <SoftBox sx={{ width: "100%", maxWidth: "400px", position: "relative", overflow: "hidden", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        {/* Sliding Toggle for User Type */}
        <SoftBox sx={{ display: "flex", backgroundColor: "#f8f9fa", borderRadius: "8px 8px 0 0" }}>
          <SoftButton
            variant={userType === "patient" ? "gradient" : "text"}
            color="info"
            sx={{
              flex: 1,
              borderRadius: "8px 0 0 0",
              transition: "all 0.3s ease",
              background: userType === "patient" ? "linear-gradient(45deg, #2196F3, #21CBF3)" : "transparent",
              color: userType === "patient" ? "white" : "gray",
              "&:hover": {
                background: userType === "patient" ? "linear-gradient(45deg, #2196F3, #21CBF3)" : "#f0f0f0",
              }
            }}
            onClick={() => handleUserTypeChange("patient")}
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
              background: userType === "staff" ? "linear-gradient(45deg, #2196F3, #21CBF3)" : "transparent",
              color: userType === "staff" ? "white" : "gray",
              "&:hover": {
                background: userType === "staff" ? "linear-gradient(45deg, #2196F3, #21CBF3)" : "#f0f0f0",
              }
            }}
            onClick={() => handleUserTypeChange("staff")}
          >
            Medical Staff
          </SoftButton>
        </SoftBox>

        {/* Sliding Form Content */}
        <SoftBox component="form" role="form" sx={{ padding: 3, backgroundColor: "white" }}>
          <SoftBox mb={2}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" sx={{ display: "block", mb: 1 }}>
              {userType === "staff" ? "matricule" : "CIN"}
            </SoftTypography>
            <SoftInput
              type="text"
              placeholder={userType === "staff" ? "Enter your matricule" : "Enter your CIN"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </SoftBox>

          <SoftBox mb={2}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" sx={{ display: "block", mb: 1 }}>
              Password
            </SoftTypography>
            <SoftInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </SoftBox>

          <SoftBox display="flex" alignItems="center" mb={3}>
            <Switch checked={rememberMe} onChange={handleSetRememberMe} />
            <SoftTypography variant="button" onClick={handleSetRememberMe} sx={{ cursor: "pointer", userSelect: "none", ml: 1 }}>
              Remember me
            </SoftTypography>
          </SoftBox>

          <SoftButton variant="gradient" color="info" fullWidth onClick={handleSignIn}>
            {loading ? "Signing In..." : "Sign in"}
          </SoftButton>

          {error && (
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="body2" color="error">
                {error}
              </SoftTypography>
            </SoftBox>
          )}

          {userType === "patient" && (
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Don&apos;t have an account?{" "}
                <SoftTypography component={Link} to="/authentication/sign-up" variant="button" color="info" fontWeight="bold">
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
