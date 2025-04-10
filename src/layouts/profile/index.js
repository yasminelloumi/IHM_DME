import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import PlaceholderCard from "examples/Cards/PlaceholderCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function Overview() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("connectedUser");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setProfile(user);
    }
  }, []);

  return (
    <DashboardLayout>
      <Header />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={4}>
          </Grid>

          <Grid item xs={12} md={6} xl={4}>
            {profile && (
              <ProfileInfoCard
                title="Profile Information"
                description={`Hello, I'm ${profile.nom} ${profile.prenom}`}
                info={{
                  cin: profile.CIN,
                  fullName: `${profile.nom} ${profile.prenom}`,
                  mobile: profile.tel,
                  birthDate: profile.dateNaissance,
                  nationality: profile.nationalite,
                }}
              
                action={{ route: "", tooltip: "Edit Profile" }}
              />
            )}
          </Grid>

          <Grid item xs={12} xl={4}>
            
          </Grid>
        </Grid>
      </SoftBox>


      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
