import React from "react";
import Dashboard from "layouts/dashboard";
import PatientDiseases from "layouts/Diseases/PatientDiseases";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// Icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import MedicalServices from "@mui/icons-material/MedicalServices";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Science from "@mui/icons-material/Science";
import Collections from "@mui/icons-material/Collections";

import PatientT from "layouts/TablePatient";
import PatientConsultations from "layouts/PatientConsultations/PatientConsultations";  
import CentreImage from "layouts/CentreImagerie";
import Labo from "layouts/Laboratoire";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <MedicalServices size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  { 
    type: "title", 
    title: "Patient Management", 
    key: "patient-management" 
  },
  {
    type: "collapse",
    name: "Liste Patient",
    key: "TablePatient",
    route: "/TablePatient",
    icon: <Shop size="12px" />,
    component: <PatientT />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Diseases",
    key: "patient-diseases",
    route: "/diseases",
    icon: <MedicalServices size="12px" />,
    component: <PatientDiseases />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Consultations",
    key: "patient-consultations",
    route: "/consultations",
    icon: <CalendarToday size="12px" />,
    component: <PatientConsultations />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Laboratory",
    key: "patient-laboratory",
    route: "/laboratory",
    icon: <Science size="12px" />,
    component: <Labo />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Medical Imaging",
    key: "patient-imaging",
    route: "/imaging",
    icon: <Collections size="12px" />,
    component: <CentreImage />,
    noCollapse: true,
  },
  { 
    type: "title", 
    title: "Account Pages", 
    key: "account-pages" 
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <MedicalServices size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <MedicalServices size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <MedicalServices size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
];

export default routes;