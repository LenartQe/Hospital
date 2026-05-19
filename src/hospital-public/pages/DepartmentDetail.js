import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";

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

  return (
    <section className="section department-single">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="department-content">
              <h2 className="mb-4">{d.name}</h2>
              <p>{d.description}</p>
              <p>
                <strong>Vendndodhja:</strong> {d.location || "—"}
              </p>
              <p>
                <strong>Kreu i departamentit:</strong> {d.headDoctorName || "—"}
              </p>
            </div>
            <h4 className="mt-5 mb-3">Mjekët në këtë departament</h4>
            <ul className="list-unstyled">
              {doctors.map((doc) => (
                <li key={doc.id}>
                  <Link to={`/doctors/${doc.id}`}>{doc.fullName}</Link> — {doc.specialty}
                </li>
              ))}
              {doctors.length === 0 && <li>Nuk ka mjekë të listuar ende.</li>}
            </ul>
          </div>
        </div>
        <Link to="/departments" className="btn btn-main mt-3">
          Të gjitha departamentet
        </Link>
      </div>
    </section>
  );
}
