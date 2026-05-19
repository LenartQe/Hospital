/**
=========================================================
* Hospital System — admin routes (Material Dashboard shell)
=========================================================
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

import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Paneli",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Departamentet",
    key: "hospital-departments",
    icon: <Icon fontSize="small">apartment</Icon>,
    route: "/hospital/departments",
    component: <HospitalDepartments />,
  },
  {
    type: "collapse",
    name: "Mjekët",
    key: "hospital-doctors",
    icon: <Icon fontSize="small">medical_services</Icon>,
    route: "/hospital/doctors",
    component: <HospitalDoctors />,
  },
  {
    type: "collapse",
    name: "Barnat",
    key: "hospital-medicines",
    icon: <Icon fontSize="small">medication</Icon>,
    route: "/hospital/medicines",
    component: <HospitalMedicines />,
  },
  {
    type: "collapse",
    name: "Takimet",
    key: "hospital-appointments",
    icon: <Icon fontSize="small">event</Icon>,
    route: "/hospital/appointments",
    component: <HospitalAppointments />,
  },
  {
    type: "collapse",
    name: "Njoftimet",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profili",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Hyrja",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Regjistrimi",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    hideFromSidenav: true,
  },
];

export default routes;
