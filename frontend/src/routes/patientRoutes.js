import PatientDashboard from "layouts/patient/PatientDashboard";
import Icon from "@mui/material/Icon";

const patientRoutes = [
  {
    type: "collapse",
    name: "Paneli im",
    key: "patient-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/patient/dashboard",
    component: <PatientDashboard />,
    roles: ["PATIENT"],
  },
];

export default patientRoutes;
