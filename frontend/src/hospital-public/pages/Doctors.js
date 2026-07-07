import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";
import { DOCTOR_PFP_FALLBACK, doctorPhoto } from "../hospitalImages";

function dedupeDoctors(list) {
  const byEmail = new Map();
  list.forEach((d) => {
    const key = (d.email || `id-${d.id}`).toLowerCase();
    if (!byEmail.has(key)) {
      byEmail.set(key, d);
    }
  });
  return [...byEmail.values()].sort((a, b) =>
    (a.fullName || "").localeCompare(b.fullName || "", "sq")
  );
}

function DoctorCard({ doc }) {
  const [imgSrc, setImgSrc] = useState(doctorPhoto(doc));

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <article className="hospital-doctor-card h-100">
        <div className="hospital-doctor-card__photo-wrap">
          <img
            src={imgSrc}
            alt={doc.fullName}
            className="hospital-doctor-card__photo"
            loading="lazy"
            onError={() => setImgSrc(DOCTOR_PFP_FALLBACK)}
          />
        </div>
        <div className="hospital-doctor-card__body text-center">
          <h4 className="hospital-doctor-card__name mb-1">
            <Link to={`/doctors/${doc.id}`}>{doc.fullName}</Link>
          </h4>
          <p className="hospital-doctor-card__specialty mb-1">{doc.specialty || doc.specialization}</p>
          <p className="hospital-doctor-card__dept mb-3">{doc.department?.name}</p>
          <Link to={`/appointment?doctorId=${doc.id}`} className="btn btn-main btn-sm btn-round-full">
            Rezervo termin
          </Link>
        </div>
      </article>
    </div>
  );
}

export default function Doctors() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalApi.doctors
      .list()
      .then((list) => setItems(dedupeDoctors(list)))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const doctors = useMemo(() => dedupeDoctors(items), [items]);

  if (err) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-danger">Nuk u ngarkuan mjekët. ({err})</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section hospital-doctors-page">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div className="section-title">
              <h2 className="text-md text-uppercase letter-spacing mb-1">Mjekët</h2>
              <div className="divider mx-auto mb-4" />
              <p className="text-muted mb-0">
                Ekipi ynë mjekësor — zgjidhni specialistin dhe rezervoni termin direkt nga faqja.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted py-5">Duke ngarkuar mjekët…</p>
        ) : (
          <div className="row justify-content-center">
            {doctors.map((doc) => (
              <DoctorCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}

        {!loading && doctors.length === 0 ? (
          <p className="text-center text-muted">Nuk ka mjekë të listuar për momentin.</p>
        ) : null}
      </div>
    </section>
  );
}
