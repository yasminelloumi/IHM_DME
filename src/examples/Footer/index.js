import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import { Divider, IconButton, Tooltip } from "@mui/material";
import {
  Email,
  Phone,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  ArrowUpward,
  ArrowDownward,
  Link as LinkIcon,
  Copyright,
} from "@mui/icons-material";

import logo from "assets/images/logo4pg.png";
import { useState, useEffect } from "react";

// Define custom styles for the footer
const footerStyles = {
  container: {
    width: "100%",
    background: "linear-gradient(135deg, #0077b6 0%, #005f8d 100%)",
    color: "#ffffff",
    py: 2,
    px: { xs: 2, md: 4 },
    boxShadow: "0 -6px 16px rgba(0, 0, 0, 0.15)",
    position: "relative",
    animation: "fadeIn 1s ease-in-out",
    borderTop: "4px solid #e6f0ff",
  },
  section: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "space-between",
    gap: 3,
    maxWidth: "1300px",
    mx: "auto",
  },
  column: {
    flex: 1,
    minWidth: { xs: "100%", md: "120px" },
    mb: { xs: 2, md: 0 },
  },
  centeredColumn: {
    flex: 1,
    minWidth: { xs: "100%", md: "120px" },
    mb: { xs: 2, md: 0 },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    display: "block",
    mb: 1,
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#e6f0ff",
      textDecoration: "underline",
      transform: "translateX(8px)",
    },
    fontSize: "1.1rem",
    lineHeight: 1.6,
    textAlign: "center",
    animation: "fadeInLink 0.5s ease-in-out",
    animationDelay: (props) => `${props.index * 0.1}s`,
    animationFillMode: "both",
  },
  socialIcon: {
    fontSize: "1.8rem",
    color: "#ffffff",
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#e6f0ff",
      transform: "scale(1.2)",
    },
  },
  newsletterInput: {
    "& .MuiInputBase-root": {
      borderRadius: "8px",
      backgroundColor: "#fff",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      color: "#000",
      fontSize: "1rem",
      padding: "6px 10px",
    },
    "& .MuiInputBase-input": {
      color: "#000",
    },
  },
  subscribeButton: {
    background: "linear-gradient(135deg, #e6f0ff 0%, #d1e2ff 100%)",
    color: "#0077b6",
    borderRadius: "8px",
    px: 2.5,
    py: 1,
    fontSize: "1rem",
    fontWeight: "bold",
    "&:hover": {
      background: "linear-gradient(135deg, #d1e2ff 0%, #b3cde0 100%)",
      transform: "scale(1.05)",
      boxShadow: "0 4px 12px rgba(0, 119, 182, 0.3)",
    },
    "&:disabled": {
      background: "linear-gradient(135deg, #cccccc 0%, #b3b3b3 100%)",
      color: "#666",
    },
    transition: "all 0.3s ease",
  },
  scrollButton: {
    position: "fixed",
    bottom: "40px",
    right: "40px",
    backgroundColor: "#ffffff",
    color: "#0077b6",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    borderRadius: "50%",
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#e6f0ff",
      transform: "scale(1.15)",
      boxShadow: "0 10px 24px rgba(0, 0, 0, 0.25)",
    },
  },
  divider: {
    my: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  logo: {
    width: "140px",
    height: "auto",
    mb: 2,
    filter: "brightness(0) invert(1)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      filter: "brightness(0) invert(1) drop-shadow(0 0 8px rgba(230, 240, 255, 0.5))",
    },
  },
  heading: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    mb: 2,
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  text: {
    fontSize: "1rem",
    lineHeight: 1.5,
    opacity: 0.9,
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#e6f0ff",
      transform: "translateX(4px)",
    },
  },
};

// Define keyframes for animations
const keyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeInLink {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject keyframes into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

function Footer({ company, links, contact, socials }) {
  const { href = "", name = "EMR Solutions" } = company || {};

  const [isAtTop, setIsAtTop] = useState(true);
  const [email, setEmail] = useState(""); // State for email input

  // Track scroll position to toggle arrow direction
  useEffect(() => {
    console.log("Footer links prop:", links);
  }, [links]);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (isAtTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle newsletter subscription
  const handleSubscribe = () => {
    if (email.trim()) {
      alert(`Subscribed with email: ${email}`);
      setEmail("");
    }
  };

  const renderLinks = () => {
    const linksToRender = Array.isArray(links) ? links : Footer.defaultProps.links;

    if (!linksToRender || linksToRender.length === 0) {
      return (
        <SoftTypography variant="body2" color="inherit" sx={footerStyles.text}>
          No links available.
        </SoftTypography>
      );
    }
    return linksToRender.map((link, index) => (
      <Link
        key={link.name}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ ...footerStyles.link, index }}
      >
        <SoftTypography variant="body2" fontWeight="regular" color="inherit">
          {link.name}
        </SoftTypography>
      </Link>
    ));
  };

  const renderSocials = () =>
    (socials || []).map((social) => (
      <Tooltip key={social.name} title={`Visit our ${social.name}`} placement="top">
        <IconButton
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit our ${social.name} page`}
          sx={footerStyles.socialIcon}
        >
          {social.icon}
        </IconButton>
      </Tooltip>
    ));

  return (
    <SoftBox component="footer" sx={footerStyles.container}>
      <SoftBox sx={footerStyles.section}>
        {/* Company Info */}
        <SoftBox sx={footerStyles.column}>
          <Link href={href} target="_blank" rel="noopener noreferrer">
            <SoftBox
              component="img"
              src={logo}
              alt={`${name} logo`}
              sx={footerStyles.logo}
            />
          </Link>
          <SoftTypography variant="h5" sx={footerStyles.heading}>
            {name}
          </SoftTypography>
          <SoftTypography variant="body2" sx={footerStyles.text} mb={2}>
            Empowering smarter, faster, and safer healthcare through electronic medical records.
          </SoftTypography>
          <SoftBox display="flex" alignItems="center" mb={1}>
            <Email sx={{ mr: 1, color: "#e6f0ff", fontSize: "1.3rem" }} />
            <SoftTypography variant="body2" sx={footerStyles.text}>
              {contact?.email || "support@emrsolutions.com"}
            </SoftTypography>
          </SoftBox>
          <SoftBox display="flex" alignItems="center">
            <Phone sx={{ mr: 1, color: "#e6f0ff", fontSize: "1.3rem" }} />
            <SoftTypography variant="body2" sx={footerStyles.text}>
              {contact?.phone || "+1 (555) 123-4567"}
            </SoftTypography>
          </SoftBox>
        </SoftBox>

        {/* Quick Links */}
        <SoftBox sx={footerStyles.centeredColumn}>
          <SoftBox sx={footerStyles.heading}>
            <LinkIcon sx={{ mr: 1, color: "#e6f0ff", fontSize: "1.8rem" }} />
            <SoftTypography variant="h6" color="inherit">
              Quick Links
            </SoftTypography>
          </SoftBox>
          <SoftBox display="flex" flexDirection="column">
            {renderLinks()}
          </SoftBox>
        </SoftBox>

        {/* Newsletter Subscription */}
        <SoftBox sx={footerStyles.column}>
          <SoftBox sx={footerStyles.heading}>
            <Email sx={{ mr: 1, color: "#e6f0ff", fontSize: "1.8rem" }} />
            <SoftTypography variant="h6" color="inherit">
              Stay Updated
            </SoftTypography>
          </SoftBox>
          <SoftTypography variant="body2" sx={footerStyles.text} mb={2}>
            Subscribe to our newsletter for the latest updates and tips.
          </SoftTypography>
          <SoftBox display="flex" gap={1}>
            <SoftInput
              placeholder="Your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={footerStyles.newsletterInput}
              aria-label="Email for newsletter subscription"
            />
            <SoftButton
              sx={footerStyles.subscribeButton}
              onClick={handleSubscribe}
              disabled={!email.trim()}
              aria-label="Subscribe to newsletter"
            >
              Subscribe
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>

      {/* Divider */}
      <Divider sx={footerStyles.divider} />

      {/* Bottom Section: Copyright, Socials */}
      <SoftBox
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        maxWidth="1300px"
        mx="auto"
        px={2}
      >
        <SoftBox display="flex" alignItems="center" gap={1}>
          <Copyright sx={{ fontSize: "1rem", color: "#e6f0ff" }} />
          <SoftTypography variant="body2" sx={footerStyles.text}>
            {new Date().getFullYear()} {name}. All rights reserved.
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex" gap={1.5} my={{ xs: 2, md: 0 }}>
          {renderSocials()}
        </SoftBox>
      </SoftBox>

      {/* Scroll Button */}
      <Tooltip title={isAtTop ? "Scroll to bottom" : "Back to top"} placement="left">
        <IconButton
          onClick={handleScroll}
          sx={footerStyles.scrollButton}
          aria-label={isAtTop ? "Scroll to bottom" : "Scroll to top"}
        >
          {isAtTop ? <ArrowDownward sx={{ fontSize: "2rem" }} /> : <ArrowUpward sx={{ fontSize: "2rem" }} />}
        </IconButton>
      </Tooltip>
    </SoftBox>
  );
}

Footer.defaultProps = {
  company: { href: "https://www.emrsolutions.com/", name: "EMR Solutions" },
  links: [
    { href: "/dashboard", name: "Home" },
    { href: "https://www.emrsolutions.com/about-us", name: "About Us" },
    { href: "https://www.emrsolutions.com/blog", name: "Blog" },
    { href: "https://www.emrsolutions.com/contact", name: "Contact Us" },
    { href: "https://www.emrsolutions.com/privacy", name: "Privacy Policy" },
  ],
  contact: {
    email: "support@emrsolutions.com",
    phone: "+1 (555) 123-4567",
  },
  socials: [
    { name: "Facebook", href: "https://www.facebook.com", icon: <Facebook /> },
    { name: "Twitter", href: "https://www.twitter.com", icon: <Twitter /> },
    { name: "LinkedIn", href: "https://www.linkedin.com", icon: <LinkedIn /> },
    { name: "Instagram", href: "https://www.instagram.com", icon: <Instagram /> },
  ],
};

Footer.propTypes = {
  company: PropTypes.shape({
    href: PropTypes.string,
    name: PropTypes.string,
  }),
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  contact: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
  socials: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      href: PropTypes.string,
      icon: PropTypes.node,
    })
  ),
};

export default Footer;