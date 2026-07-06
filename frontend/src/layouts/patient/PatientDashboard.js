import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { hospitalApi, parseApiError } from "api/hospitalApi";
import PatientPortalLayout, { PATIENT_MENU } from "layouts/patient/PatientPortalLayout";
import PatientEmptyState from "layouts/patient/PatientEmptyState";

const STATUS_SQ = {
  PENDING: "Në pritje",
  CONFIRMED: "Konfirmuar",
  REJECTED: "Refuzuar",
  CANCELLED: "Anuluar",
  COMPLETED: "Përfunduar",
};

function formatMoney(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("sq-AL", { style: "currency", currency: "EUR" }).format(amount);
}

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
            <h4>{d.title || d.diagnosisName}</h4>
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
                <th>Çmimi</th>
                <th>Mjeku</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={p.id}>
                  <td>{p.medicine?.name}</td>
                  <td>{p.dosage}</td>
                  <td>{p.frequency}</td>
                  <td>{formatMoney(p.medicine?.price)}</td>
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

function BillingCard({ invoiceLines, invoiceTotal }) {
  return (
    <article className="patient-card">
      <h2 className="patient-card__title">
        <span className="material-icons-round">receipt_long</span>
        Fatura e pagesës
      </h2>
      {invoiceLines?.length ? (
        <>
          <div className="patient-table-wrap">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Barna</th>
                  <th>Doza</th>
                  <th>Mjeku</th>
                  <th>Data</th>
                  <th>Çmimi</th>
                </tr>
              </thead>
              <tbody>
                {invoiceLines.map((line) => (
                  <tr key={line.prescriptionId}>
                    <td>{line.medicineName}</td>
                    <td>
                      {line.dosage}
                      {line.frequency ? ` · ${line.frequency}` : ""}
                    </td>
                    <td>{line.doctorName}</td>
                    <td>{formatDate(line.prescribedAt)}</td>
                    <td>{formatMoney(line.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600, color: "#334155" }}>Totali për t&apos;u paguar</span>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1d4ed8" }}>
              {formatMoney(invoiceTotal)}
            </span>
          </div>
          <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#64748b" }}>
            Fatura përfshin barnat e përshkruara nga mjekët tuaj. Për pagesë në recepsion, tregoni
            email-in e llogarisë suaj.
          </p>
        </>
      ) : (
        <PatientEmptyState
          icon="payments"
          message="Nuk ka fatura aktive. Barnat e përshkruara do të shfaqen këtu me çmimet."
        />
      )}
    </article>
  );
}

BillingCard.propTypes = {
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
  invoiceTotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
            <BillingCard invoiceLines={data?.invoiceLines} invoiceTotal={data?.invoiceTotal} />
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
