/**
=========================================================
* Hospital System Management — public site + Material Dashboard admin
=========================================================
*/

import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Sidenav from "examples/Sidenav";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setLayout } from "context";

import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

import PublicLayout from "hospital-public/PublicLayout";
import Home from "hospital-public/pages/Home";
import About from "hospital-public/pages/About";
import Services from "hospital-public/pages/Services";
import Departments from "hospital-public/pages/Departments";
import DepartmentDetail from "hospital-public/pages/DepartmentDetail";
import Doctors from "hospital-public/pages/Doctors";
import DoctorDetail from "hospital-public/pages/DoctorDetail";
import Appointment from "hospital-public/pages/Appointment";
import Contact from "hospital-public/pages/Contact";

function isPublicRoute(pathname) {
  if (pathname === "/") return true;
  if (["/about", "/services", "/appointment", "/contact"].includes(pathname)) return true;
  if (pathname.startsWith("/departments")) return true;
  if (pathname.startsWith("/doctors")) return true;
  return false;
}

function resolveLayout(pathname) {
  if (pathname.startsWith("/authentication")) return "vr";
  if (isPublicRoute(pathname)) return "vr";
  return "dashboard";
}

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  useEffect(() => {
    setLayout(dispatch, resolveLayout(pathname));
  }, [pathname, dispatch]);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  const dashboardShell =
    layout === "dashboard" ? (
      <>
        <Sidenav
          color={sidenavColor}
          brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
          brandName="Administrimi — Spitali"
          routes={routes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      </>
    ) : null;

  const appRoutes = (
    <>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="departments" element={<Departments />} />
        <Route path="departments/:id" element={<DepartmentDetail />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:id" element={<DoctorDetail />} />
        <Route path="appointment" element={<Appointment />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      {getRoutes(routes)}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {dashboardShell}
        <Routes>{appRoutes}</Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {dashboardShell}
      <Routes>{appRoutes}</Routes>
    </ThemeProvider>
  );
}
