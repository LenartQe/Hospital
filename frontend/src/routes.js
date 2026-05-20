/**
 * Admin hospital management routes (Material Dashboard shell)
 */

import Dashboard from "layouts/dashboard";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import HospitalDepartments from "layouts/hospital/HospitalDepartments";
import HospitalDoctors from "layouts/hospital/HospitalDoctors";
import HospitalMedicines from "layouts/hospital/HospitalMedicines";
import HospitalAppointments from "layouts/hospital/HospitalAppointments";
import patientRoutes from "routes/patientRoutes";
import doctorRoutes from "routes/doctorRoutes";

import Icon from "@mui/material/Icon";

const adminRoutes = [
  {
    type: "collapse",
    name: "Paneli web",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    roles: ["ADMIN"],
  },
  {
    type: "collapse",
    name: "Departamentet",
    key: "hospital-departments",
    icon: <Icon fontSize="small">apartment</Icon>,
    route: "/hospital/departments",
    component: <HospitalDepartments />,
    roles: ["ADMIN"],
  },
  {
    type: "collapse",
    name: "Mjekët",
    key: "hospital-doctors",
    icon: <Icon fontSize="small">medical_services</Icon>,
    route: "/hospital/doctors",
    component: <HospitalDoctors />,
    roles: ["ADMIN"],
  },
  {
    type: "collapse",
    name: "Barnat",
    key: "hospital-medicines",
    icon: <Icon fontSize="small">medication</Icon>,
    route: "/hospital/medicines",
    component: <HospitalMedicines />,
    roles: ["ADMIN"],
  },
  {
    type: "collapse",
    name: "Terminet",
    key: "hospital-appointments",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/hospital/appointments",
    component: <HospitalAppointments />,
    roles: ["ADMIN"],
  },
  {
    type: "collapse",
    name: "Njoftimet",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    roles: ["ADMIN"],
  },
  {
    type: "collapse",
    name: "Profili",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    roles: ["ADMIN"],
  },
  {
    type: "collapse",
    name: "Hyrja",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    hideFromSidenav: true,
    public: true,
  },
  {
    type: "collapse",
    name: "Regjistrimi",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    hideFromSidenav: true,
    public: true,
  },
];

export function routesForRole(role) {
  if (role === "PATIENT") return patientRoutes;
  if (role === "DOCTOR") return doctorRoutes;
  return adminRoutes.filter((r) => !r.public);
}

export function allAppRoutes() {
  return [...adminRoutes, ...patientRoutes, ...doctorRoutes];
}

export default adminRoutes;
