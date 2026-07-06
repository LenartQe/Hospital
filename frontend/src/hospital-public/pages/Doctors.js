import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face";

/** Unique public pfps when API image is missing or fails to load. */
const LOCAL_PFP = {
  sara: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
  kadri: "https://images.unsplash.com/photo-1622253692010-21aabed25171?w=400&h=400&fit=crop&crop=face",
  emir: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
  lenart: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
  mimoza: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
  blerdon: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop&crop=face",
};

function pfpForDoctor(doc) {
  const name = (doc.fullName || "").toLowerCase();
  if (name.includes("sara")) return LOCAL_PFP.sara;
  if (name.includes("kadri")) return LOCAL_PFP.kadri;
  if (name.includes("emir")) return LOCAL_PFP.emir;
  if (name.includes("lenart")) return LOCAL_PFP.lenart;
  if (name.includes("mimoza")) return LOCAL_PFP.mimoza;
  if (name.includes("blerdon")) return LOCAL_PFP.blerdon;
  return doc.imageUrl || FALLBACK_IMG;
}

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
  const [imgSrc, setImgSrc] = useState(pfpForDoctor(doc));

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <article className="hospital-doctor-card h-100">
        <div className="hospital-doctor-card__photo-wrap">
          <img
            src={imgSrc}
            alt={doc.fullName}
            className="hospital-doctor-card__photo"
            loading="lazy"
            onError={() => setImgSrc(FALLBACK_IMG)}
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
