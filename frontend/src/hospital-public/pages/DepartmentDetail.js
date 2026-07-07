import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";
import FallbackImage from "../components/FallbackImage";
import { deptVisual } from "../hospitalImages";

export default function DepartmentDetail() {
  const { id } = useParams();
  const [d, setD] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    hospitalApi.departments
      .get(id)
      .then(setD)
      .catch((e) => setErr(e.message));
    hospitalApi.doctors
      .list(Number(id))
      .then(setDoctors)
      .catch(() => {});
  }, [id]);

  if (err) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-danger">{err}</p>
          <Link to="/departments">Kthehu</Link>
        </div>
      </section>
    );
  }
  if (!d) {
    return (
      <section className="section">
        <div className="container">Duke u ngarkuar…</div>
      </section>
    );
  }

  const { images, icon, imageClass } = deptVisual(d.name);
  const imgClass = ["hospital-dept-hero__img", imageClass].filter(Boolean).join(" ");

  return (
    <section className="section department-single hospital-departments-page">
      <div className="container">
        <div className="hospital-dept-hero mb-5">
          <FallbackImage sources={images} alt={d.name} className={imgClass} />
          <div className="hospital-dept-hero__overlay">
            <span className="hospital-dept-card__icon-badge hospital-dept-hero__badge">
              <i className={icon} />
            </span>
            <h2 className="hospital-dept-hero__title mb-0">{d.name}</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="hospital-dept-detail-card mb-5">
              <p className="mb-3">{d.description || "—"}</p>
              <p className="mb-2">
                <strong>Vendndodhja:</strong> {d.location || "—"}
              </p>
              <p className="mb-0">
                <strong>Kreu i departamentit:</strong> {d.headDoctorName || "—"}
              </p>
            </div>

            <h4 className="mb-3">Mjekët në këtë departament</h4>
            <div className="row">
              {doctors.map((doc) => (
                <div key={doc.id} className="col-md-6 mb-3">
                  <Link to={`/doctors/${doc.id}`} className="hospital-dept-doctor-link">
                    <strong>{doc.fullName}</strong>
                    <span className="d-block text-muted small">{doc.specialty}</span>
                  </Link>
                </div>
              ))}
              {doctors.length === 0 && <p className="text-muted">Nuk ka mjekë të listuar ende.</p>}
            </div>
          </div>
        </div>

        <Link to="/departments" className="btn btn-main mt-4">
          Të gjitha departamentet
        </Link>
      </div>
    </section>
  );
}
