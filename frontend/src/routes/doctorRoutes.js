import DoctorDashboard from "layouts/doctor/DoctorDashboard";
import DoctorAppointments from "layouts/doctor/DoctorAppointments";
import DoctorPatients from "layouts/doctor/DoctorPatients";
import DoctorDiagnoses from "layouts/doctor/DoctorDiagnoses";
import DoctorPrescriptions from "layouts/doctor/DoctorPrescriptions";
import DoctorProfile from "layouts/doctor/DoctorProfile";
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
    name: "Terminet",
    key: "doctor-appointments",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/doctor/appointments",
    component: <DoctorAppointments />,
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
  {
    type: "collapse",
    name: "Diagnozat",
    key: "doctor-diagnoses",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/doctor/diagnoses",
    component: <DoctorDiagnoses />,
    roles: ["DOCTOR"],
  },
  {
    type: "collapse",
    name: "Recetat",
    key: "doctor-prescriptions",
    icon: <Icon fontSize="small">medication</Icon>,
    route: "/doctor/prescriptions",
    component: <DoctorPrescriptions />,
    roles: ["DOCTOR"],
  },
  {
    type: "collapse",
    name: "Profili",
    key: "doctor-profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/doctor/profile",
    component: <DoctorProfile />,
    roles: ["DOCTOR"],
  },
];

export default doctorRoutes;
