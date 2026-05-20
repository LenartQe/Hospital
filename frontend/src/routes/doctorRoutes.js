import DoctorDashboard from "layouts/doctor/DoctorDashboard";
import DoctorPatients from "layouts/doctor/DoctorPatients";
import Icon from "@mui/material/Icon";

const doctorRoutes = [
  {
    type: "collapse",
    name: "Paneli",
    key: "doctor-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/doctor/dashboard",
    component: <DoctorDashboard />,
    roles: ["DOCTOR"],
  },
  {
    type: "collapse",
    name: "Pacientët",
    key: "doctor-patients",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/doctor/patients",
    component: <DoctorPatients />,
    roles: ["DOCTOR"],
  },
];

export default doctorRoutes;
