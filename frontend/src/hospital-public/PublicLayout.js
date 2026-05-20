import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_MAILTO,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "./contactInfo";
import "./hospital-site.css";

const telHref = `tel:${CONTACT_PHONE_TEL}`;

export default function PublicLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div id="top">
      <header>
        <div className="header-top-bar">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <ul className="top-bar-info list-inline-item pl-0 mb-0">
                  <li className="list-inline-item">
                    <a href={CONTACT_EMAIL_MAILTO}>
                      <i className="icofont-support-faq mr-2" />
                      {CONTACT_EMAIL}
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <i className="icofont-location-pin mr-2" />
                    Spitali i Prizrenit
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <div className="text-lg-right top-right-bar mt-2 mt-lg-0">
                  <NavLink
                    to="/authentication/sign-in?role=patient"
                    className="btn btn-sm btn-light mr-1"
                  >
                    Pacient
                  </NavLink>
                  <NavLink
                    to="/authentication/sign-in?role=doctor"
                    className="btn btn-sm btn-light mr-1"
                  >
                    Mjek
                  </NavLink>
                  <NavLink
                    to="/authentication/sign-in?role=admin"
                    className="btn btn-sm btn-main mr-2"
                  >
                    Administrim
                  </NavLink>
                  <span className="hospital-phone-label">Telefoni:</span>
                  <a href={telHref} className="hospital-phone-link">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="navbar navbar-expand-lg navigation" id="navbar">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              <img
                src={`${process.env.PUBLIC_URL}/novena/images/logo.png`}
                alt="Spitali i Prizrenit"
                className="img-fluid"
              />
            </NavLink>
            <button
              className="navbar-toggler collapsed"
              type="button"
              aria-label="Menu"
              onClick={() => setOpen(!open)}
            >
              <span className="icofont-navigation-menu" />
            </button>
            <div className={`collapse navbar-collapse${open ? " show" : ""}`} id="navbarmain">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/" end onClick={() => setOpen(false)}>
                    Ballina
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about" onClick={() => setOpen(false)}>
                    Rreth nesh
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/services" onClick={() => setOpen(false)}>
                    Shërbimet
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/departments" onClick={() => setOpen(false)}>
                    Departamentet
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/doctors" onClick={() => setOpen(false)}>
                    Mjekët
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/appointment" onClick={() => setOpen(false)}>
                    Terminet
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/contact" onClick={() => setOpen(false)}>
                    Kontakti
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <Outlet />
      <footer className="footer section gray-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mr-auto col-sm-6">
              <div className="widget mb-5 mb-lg-0">
                <div className="logo mb-4">
                  <img
                    src={`${process.env.PUBLIC_URL}/novena/images/logo.png`}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <p>
                  Spitali i Prizrenit — menaxhim ditor i departamenteve, stafit, barnatorës dhe
                  termineve me pacientët.
                </p>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="widget mb-5 mb-lg-0">
                <h4 className="text-capitalize mb-3">Lidhjet</h4>
                <div className="divider mb-4" />
                <ul className="list-unstyled footer-menu lh-35">
                  <li>
                    <NavLink to="/departments">Departamentet</NavLink>
                  </li>
                  <li>
                    <NavLink to="/doctors">Mjekët</NavLink>
                  </li>
                  <li>
                    <NavLink to="/appointment">Terminet</NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="widget widget-contact mb-5 mb-lg-0">
                <h4 className="text-capitalize mb-3">Kontakti</h4>
                <div className="divider mb-4" />
                <p>
                  <a href={CONTACT_EMAIL_MAILTO}>{CONTACT_EMAIL}</a>
                </p>
                <p>
                  <a href={telHref} className="hospital-phone-link">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="footer-btm py-4 mt-5">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-6">
                <div className="copyright">
                  &copy; {new Date().getFullYear()} Spitali i Prizrenit
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
