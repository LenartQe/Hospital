import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { hospitalApi, parseApiError } from "api/hospitalApi";
import PatientPortalLayout, { PATIENT_MENU } from "layouts/patient/PatientPortalLayout";
import PatientEmptyState from "layouts/patient/PatientEmptyState";

const STATUS_SQ = {
  PENDING: "Në pritje",
  CONFIRMED: "Konfirmuar",
  CANCELLED: "Anuluar",
  COMPLETED: "Përfunduar",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("sq-AL");
}

function ProfileCard({ data }) {
  return (
    <article className="patient-card">
      <h2 className="patient-card__title">
        <span className="material-icons-round">person</span>
        Profili im
      </h2>
      <div className="patient-profile-row">
        <span className="material-icons-round">badge</span>
        <span>
          <strong>Emri:</strong> {data.fullName}
        </span>
      </div>
      <div className="patient-profile-row">
        <span className="material-icons-round">email</span>
        <span>
          <strong>Email:</strong> {data.email}
        </span>
      </div>
      <div className="patient-profile-row">
        <span className="material-icons-round">phone</span>
        <span>
          <strong>Telefoni:</strong> {data.phone || "—"}
        </span>
      </div>
      <div className="patient-profile-row">
        <span className="material-icons-round">bloodtype</span>
        <span>
          <strong>Gjak:</strong> {data.bloodType || "—"}
        </span>
      </div>
      {data.allergies ? (
        <div className="patient-allergy-badge">
          <span className="material-icons-round">warning</span>
          <span>
            <strong>Alergjitë:</strong> {data.allergies}
          </span>
        </div>
      ) : (
        <div className="patient-profile-row">
          <span className="material-icons-round">warning_amber</span>
          <span>
            <strong>Alergjitë:</strong> —
          </span>
        </div>
      )}
      {data.notes ? (
        <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#64748b" }}>{data.notes}</p>
      ) : null}
    </article>
  );
}

ProfileCard.propTypes = {
  data: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    bloodType: PropTypes.string,
    allergies: PropTypes.string,
    notes: PropTypes.string,
  }),
};

function DiagnosesCard({ diagnoses }) {
  return (
    <article className="patient-card">
      <h2 className="patient-card__title">
        <span className="material-icons-round">assignment</span>
        Diagnozat
      </h2>
      {diagnoses?.length ? (
        diagnoses.map((d) => (
          <div key={d.id} className="patient-diagnosis-item">
            <h4>{d.title}</h4>
            <p className="meta">
              Dr. {d.doctor?.fullName} · {formatDate(d.diagnosedAt)}
              {d.severity ? ` · ${d.severity}` : ""}
            </p>
            <p>{d.description}</p>
          </div>
        ))
      ) : (
        <PatientEmptyState icon="description" message="Nuk ka diagnoza të regjistruara." />
      )}
    </article>
  );
}

DiagnosesCard.propTypes = {
  diagnoses: PropTypes.arrayOf(PropTypes.object),
};

function PrescriptionsCard({ prescriptions }) {
  return (
    <article className="patient-card">
      <h2 className="patient-card__title">
        <span className="material-icons-round">medication</span>
        Barnat e përshkruara
      </h2>
      {prescriptions?.length ? (
        <div className="patient-table-wrap">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Barna</th>
                <th>Doza</th>
                <th>Frekuenca</th>
                <th>Mjeku</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={p.id}>
                  <td>{p.medicine?.name}</td>
                  <td>{p.dosage}</td>
                  <td>{p.frequency}</td>
                  <td>{p.doctor?.fullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <PatientEmptyState icon="medication_liquid" message="Nuk ka receta aktive." />
      )}
    </article>
  );
}

PrescriptionsCard.propTypes = {
  prescriptions: PropTypes.arrayOf(PropTypes.object),
};

function AppointmentsCard({ appointments }) {
  return (
    <article className="patient-card">
      <h2 className="patient-card__title">
        <span className="material-icons-round">event</span>
        Terminet e mia
      </h2>
      {appointments?.length ? (
        <div className="patient-table-wrap">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Mjeku</th>
                <th>Statusi</th>
                <th>Mesazhi</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.preferredDate || formatDate(a.createdAt)}</td>
                  <td>{a.doctor?.fullName || "—"}</td>
                  <td>
                    <span className="patient-status">{STATUS_SQ[a.status] || a.status}</span>
                  </td>
                  <td>{a.message || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <PatientEmptyState
          icon="event_busy"
          message="Nuk keni termine të lidhura me llogarinë. Rezervoni nga faqja publike."
        />
      )}
    </article>
  );
}

AppointmentsCard.propTypes = {
  appointments: PropTypes.arrayOf(PropTypes.object),
};

export default function PatientDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    hospitalApi.patient
      .dashboard()
      .then(setData)
      .catch((e) => setError(parseApiError(e)));
  }, []);

  const menuItem = PATIENT_MENU.find((m) => m.id === activeSection);
  const pageTitle = menuItem?.label || "Paneli i pacientit";

  const renderSection = () => {
    if (!data && !error) {
      return <PatientEmptyState icon="hourglass_empty" message="Duke ngarkuar të dhënat..." />;
    }

    switch (activeSection) {
      case "appointments":
        return (
          <div className="patient-portal__grid patient-portal__grid--wide">
            <AppointmentsCard appointments={data?.appointments} />
          </div>
        );
      case "history":
        return (
          <div className="patient-portal__grid patient-portal__grid--wide">
            <DiagnosesCard diagnoses={data?.diagnoses} />
          </div>
        );
      case "prescriptions":
        return (
          <div className="patient-portal__grid patient-portal__grid--wide">
            <PrescriptionsCard prescriptions={data?.prescriptions} />
          </div>
        );
      case "billing":
        return (
          <div className="patient-portal__grid patient-portal__grid--wide">
            <article className="patient-card">
              <h2 className="patient-card__title">
                <span className="material-icons-round">receipt_long</span>
                Faturat & Pagesat
              </h2>
              <PatientEmptyState
                icon="payments"
                message="Moduli i faturave do të aktivizohet së shpejti. Kontaktoni recepsionin për pagesa."
              />
            </article>
          </div>
        );
      case "home":
      default:
        return (
          <div className="patient-portal__grid">
            <ProfileCard data={data} />
            <DiagnosesCard diagnoses={data?.diagnoses} />
            <PrescriptionsCard prescriptions={data?.prescriptions} />
            <div style={{ gridColumn: "1 / -1" }}>
              <AppointmentsCard appointments={data?.appointments} />
            </div>
          </div>
        );
    }
  };

  return (
    <PatientPortalLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      pageTitle={pageTitle}
    >
      {error ? <div className="patient-portal__error">{error}</div> : null}
      {renderSection()}
    </PatientPortalLayout>
  );
}
