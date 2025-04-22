import React from "react";
import Dashboard from "layouts/dashboard";
import PatientDiseases from "layouts/Diseases/PatientDiseases";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// Icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import MedicalServices from "@mui/icons-material/MedicalServices";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Science from "@mui/icons-material/Science";
import Collections from "@mui/icons-material/Collections";
import Description from "@mui/icons-material/Description";

import PatientT from "layouts/TablePatient";
import PatientConsultations from "layouts/PatientConsultations/PatientConsultations";  
import CentreImage from "layouts/CentreImagerie";
import Labo from "layouts/Laboratoire";
import ListPatientData from "layouts/ListPatientData/data/ListPatientData";
import Overview from "layouts/profile";
import ListDatas from "layouts/ListPatientData";
import Reports from "layouts/Reports";

const getUserRole = () => {
  const connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
  return connectedUser?.role || null;
};

const routes = [
  {
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <MedicalServices size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  ...(getUserRole() !== 'centreImagerie' && getUserRole() !== 'laboratoire' ?[{
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <MedicalServices size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  }] : []),
  
  { 
    type: "title", 
    title: "Patient Management", 
    key: "patient-management" 
  },
  
  ...(getUserRole() !== 'patient' && getUserRole() !== 'medecins' ? [{
    type: "collapse",
    name: "Scan QR Code",
    key: "ListPatientData",
    route: "/ScanQRCode",
    icon: <Shop size="12px" />,
    component: <ListDatas />,
    noCollapse: true,
  }] : []),
  
  ...(getUserRole() !== 'patient' && getUserRole() !== 'centreImagerie' && getUserRole() !== 'laboratoire' ? [{
    type: "collapse",
    name: "Patients List",
    key: "TablePatient",
    route: "/TablePatient",
    icon: <Shop size="12px" />,
    component: <PatientT />,
    noCollapse: true,
  }] : []),
  
  ...(getUserRole() !== 'centreImagerie' && getUserRole() !== 'laboratoire' ? [{
    type: "collapse",
    name: "Diseases",
    key: "patient-diseases",
    route: "/diseases",
    icon: <MedicalServices size="12px" />,
    component: <PatientDiseases />,
    noCollapse: true,
  }] : []),

  ...(getUserRole() !== 'centreImagerie' && getUserRole() !== 'laboratoire' ? [{
    type: "collapse",
    name: "Consultations",
    key: "patient-consultations",
    route: "/consultations",
    icon: <CalendarToday size="12px" />,
    component: <PatientConsultations />,
    noCollapse: true,
  }] : []),
  
  ...(getUserRole() !== 'patient' && getUserRole() !== 'centreImagerie' && getUserRole() !== 'medecins' ? [{
    type: "collapse",
    name: "Laboratory",
    key: "patient-laboratory",
    route: "/laboratory",
    icon: <Science size="12px" />,
    component: <Labo />,
    noCollapse: true,
  }] : []),
  
  ...(getUserRole() !== 'patient' && getUserRole() !== 'laboratoire' && getUserRole() !== 'medecins' ? [{
    type: "collapse",
    name: "Medical Imaging",
    key: "patient-imaging",
    route: "/imaging",
    icon: <Collections size="12px" />,
    component: <CentreImage />,
    noCollapse: true,
  }] : []),
  
  ...(getUserRole() !== 'laboratoire' && getUserRole() !== 'medecins' && getUserRole() !== 'centreImagerie' ? [{
    type: "title", 
    title: "Account Page", 
    key: "account-pages" 
  }] : []),
  
  ...(getUserRole() !== 'medecins' && getUserRole() !== 'centreImagerie' && getUserRole() !== 'laboratoire' ? [{
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <MedicalServices size="12px" />,
    component: <Overview />,
    noCollapse: true,
  }] : []),
  
  // Reports section - accessible to patients and doctors
  ...(getUserRole() !== 'centreImagerie' && getUserRole() !== 'laboratoire' ? [{
    type: "collapse",
    name: "Reports",
    key: "reports",
    route: "/Reports",
    icon: <Description size="12px" />,
    component: <Reports />,
    noCollapse: true,
  }] : []),
  
 
  {
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <MedicalServices size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
];

export default routes;