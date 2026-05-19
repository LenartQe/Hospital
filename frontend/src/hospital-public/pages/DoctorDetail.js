import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";

export default function DoctorDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    hospitalApi.doctors
      .get(id)
      .then(setDoc)
      .catch((e) => setErr(e.message));
  }, [id]);

  if (err) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-danger">{err}</p>
          <Link to="/doctors">Kthehu</Link>
        </div>
      </section>
    );
  }
  if (!doc) {
    return (
      <section className="section">
        <div className="container">Duke u ngarkuar…</div>
      </section>
    );
  }

  return (
    <section className="section doctor-single">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="mb-3">{doc.fullName}</h2>
            <p className="text-muted">{doc.specialty}</p>
            <p>
              <strong>Departamenti:</strong>{" "}
              {doc.department ? (
                <Link to={`/departments/${doc.department.id}`}>{doc.department.name}</Link>
              ) : (
                "—"
              )}
            </p>
            <p>
              <strong>Email:</strong> {doc.email || "—"}
            </p>
            <p>
              <strong>Telefoni:</strong> {doc.phone || "—"}
            </p>
            <p>{doc.bio}</p>
            <Link to="/appointment" className="btn btn-main mt-2">
              Rezervo takimin
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
