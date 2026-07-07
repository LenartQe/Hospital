import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";
import { DOCTOR_PFP_FALLBACK, doctorPhoto } from "../hospitalImages";

export default function DoctorDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [err, setErr] = useState(null);
  const [img, setImg] = useState(DOCTOR_PFP_FALLBACK);

  useEffect(() => {
    hospitalApi.doctors
      .get(id)
      .then((d) => {
        setDoc(d);
        setImg(doctorPhoto(d));
      })
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
        <div className="row align-items-start">
          <div className="col-lg-4 mb-4 mb-lg-0 text-center">
            <img
              src={img}
              alt={doc.fullName}
              className="hospital-doctor-card__photo mx-auto"
              style={{ maxWidth: 280 }}
              onError={() => setImg(DOCTOR_PFP_FALLBACK)}
            />
          </div>
          <div className="col-lg-8">
            <h2 className="mb-2">{doc.fullName}</h2>
            <p className="text-muted mb-1">{doc.specialty || doc.specialization}</p>
            <p className="mb-3">{doc.department?.name}</p>
            <p>{doc.bio || "Mjek specialist me përvojë në kujdesin ndaj pacientit."}</p>
            <Link to={`/appointment?doctorId=${doc.id}`} className="btn btn-main btn-round-full mt-3">
              Rezervo termin
            </Link>
          </div>
        </div>
        <Link to="/doctors" className="btn btn-outline-secondary mt-4">
          Të gjithë mjekët
        </Link>
      </div>
    </section>
  );
}
