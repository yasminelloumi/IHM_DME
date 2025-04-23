import { Box, Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";

function CoverLayout({ color, title, description, image, top, children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100%",
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <Grid container justifyContent="center" sx={{ height: "100%", margin: 0 }}>
        <Grid item xs={11} sm={8} md={5} xl={3}>
          <SoftBox mt={top}>
            <SoftBox pt={3} px={3}>
              <SoftBox mb={1}>
                <SoftTypography variant="h3" fontWeight="bold" color={color} textGradient>
                  {title}
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="body2" fontWeight="regular" color="text">
                {description}
              </SoftTypography>
            </SoftBox>
            <SoftBox p={3}>{children}</SoftBox>
          </SoftBox>
        </Grid>
        <Grid item xs={12} md={5}>
          <SoftBox
            height="100%"
            display={{ xs: "none", md: "block" }}
            position="relative"
            right={{ md: "-12rem", xl: "-16rem" }}
            mr={-16}
            sx={{
              transform: "skewX(-10deg)",
              overflow: "hidden",
              borderBottomLeftRadius: ({ borders: { borderRadius } }) => borderRadius.lg,
            }}
          >
            <SoftBox
              ml={-8}
              height="100%"
              sx={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                transform: "skewX(10deg)",
              }}
            />
          </SoftBox>
        </Grid>
      </Grid>
    </Box>
  );
}

// ... (conserver les defaultProps et propTypes existants)

export default CoverLayout;