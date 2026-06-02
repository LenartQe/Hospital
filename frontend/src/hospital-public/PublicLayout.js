import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_MAILTO,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "./contactInfo";
import "./hospital-site.css";
import "./hospital-navbar.css";

const telHref = `tel:${CONTACT_PHONE_TEL}`;

const MAIN_LINKS = [
  { to: "/", label: "Ballina", end: true },
  { to: "/about", label: "Rreth nesh" },
  { to: "/services", label: "Shërbimet" },
  { to: "/departments", label: "Departamentet" },
  { to: "/doctors", label: "Mjekët" },
  { to: "/appointment", label: "Terminet" },
  { to: "/contact", label: "Kontakti" },
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div id="top">
      <header className="hospital-site-header">
        <div className="hospital-header-top">
          <div className="hospital-header-top__inner">
            <ul className="hospital-header-top__contact">
              <li>
                <a href={CONTACT_EMAIL_MAILTO}>
                  <i className="icofont-support-faq" aria-hidden />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <i className="icofont-location-pin" aria-hidden />
                Spitali i Prizrenit
              </li>
            </ul>
            <div className="hospital-header-top__actions">
              <NavLink to="/authentication/sign-in?role=patient" className="hospital-btn-outline">
                Pacient
              </NavLink>
              <NavLink to="/authentication/sign-in?role=doctor" className="hospital-btn-outline">
                Mjek
              </NavLink>
              <NavLink to="/authentication/sign-in?role=admin" className="hospital-btn-solid">
                Administrim
              </NavLink>
              <span className="hospital-header-top__phone">
                <span>Telefoni:</span>
                <a href={telHref}>{CONTACT_PHONE_DISPLAY}</a>
              </span>
            </div>
          </div>
        </div>

        <div className="hospital-header-main">
          <div className="hospital-header-main__inner">
            <NavLink className="hospital-header-main__brand" to="/" onClick={closeMenu}>
              <img
                src={`${process.env.PUBLIC_URL}/novena/images/logo.png`}
                alt="Spitali i Prizrenit"
              />
            </NavLink>
            <button
              type="button"
              className="hospital-header-main__toggle"
              aria-label="Hap menunë"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <span className="icofont-navigation-menu" />
            </button>
            <nav className={`hospital-header-main__nav${open ? " is-open" : ""}`} id="navbarmain">
              <ul className="hospital-header-main__links">
                {MAIN_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink className="nav-link" to={link.to} end={link.end} onClick={closeMenu}>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
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
