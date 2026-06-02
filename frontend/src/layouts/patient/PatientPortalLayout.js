import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "auth/authStorage";
import "./patient-portal.css";

export const PATIENT_MENU = [
  { id: "home", label: "Paneli im", icon: "dashboard" },
  { id: "appointments", label: "Terminet e mia", icon: "event" },
  { id: "history", label: "Historia medicinale", icon: "history_edu" },
  { id: "prescriptions", label: "Recetat", icon: "medication" },
  { id: "billing", label: "Faturat & Pagesat", icon: "receipt_long" },
];

export default function PatientPortalLayout({
  children,
  activeSection,
  onSectionChange,
  pageTitle,
}) {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    clearAuth();
    navigate("/authentication/sign-in?role=patient");
  };

  return (
    <div className="patient-portal">
      <aside className="patient-portal__sidebar">
        <div className="patient-portal__brand">
          <p className="patient-portal__brand-title">Portali i pacientit</p>
          <p className="patient-portal__brand-name">Spitali i Prizrenit</p>
        </div>
        <ul className="patient-portal__nav">
          {PATIENT_MENU.map((item) => (
            <li key={item.id} className="patient-portal__nav-item">
              <button
                type="button"
                className={`patient-portal__nav-btn${
                  activeSection === item.id ? " is-active" : ""
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <span className="material-icons-round">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="patient-portal__main">
        <header className="patient-portal__topbar">
          <div className="patient-portal__search-wrap">
            <span className="material-icons-round">search</span>
            <input
              type="search"
              className="patient-portal__search"
              placeholder="Kërko këtu..."
              aria-label="Kërko"
            />
          </div>
          <div className="patient-portal__topbar-actions">
            <button type="button" className="patient-portal__icon-btn" aria-label="Njoftimet">
              <span className="material-icons-round">notifications</span>
            </button>
            <div className="patient-portal__user">
              <span className="patient-portal__user-name">{auth?.fullName || "Pacient"}</span>
              <button
                type="button"
                className="patient-portal__icon-btn"
                aria-label="Dil"
                onClick={handleLogout}
              >
                <span className="material-icons-round">logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="patient-portal__content">
          <h1 className="patient-portal__page-title">{pageTitle}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

PatientPortalLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  pageTitle: PropTypes.string.isRequired,
};
