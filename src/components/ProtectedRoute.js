import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const connectedUser = JSON.parse(localStorage.getItem("connectedUser"));

  if (connectedUser && allowedRoles.includes(connectedUser.role)) {
    return children;
  } else {
    // Redirect or show an unauthorized page if the role doesn't match
    return <Navigate to="/unauthorized" />;
  }
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
