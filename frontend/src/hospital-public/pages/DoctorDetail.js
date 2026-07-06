import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";

const FALLBACK =
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face";

function doctorPhoto(doc) {
  const name = (doc.fullName || "").toLowerCase();
  if (name.includes("sara"))
    return "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face";
  if (name.includes("kadri"))
    return "https://images.unsplash.com/photo-1622253692010-21aabed25171?w=400&h=400&fit=crop&crop=face";
  if (name.includes("emir"))
    return "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face";
  if (name.includes("lenart"))
    return "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face";
  if (name.includes("mimoza"))
    return "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face";
  if (name.includes("blerdon"))
    return "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop&crop=face";
  return doc.imageUrl || FALLBACK;
}

export default function DoctorDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [err, setErr] = useState(null);
  const [img, setImg] = useState(FALLBACK);

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
    <section className="section doctor-single hospital-page-hero">
      <div className="container">
        <div className="row align-items-start">
          <div className="col-lg-4 text-center mb-4 mb-lg-0">
            <img
              src={img}
              alt={doc.fullName}
              className="hospital-doctor-card__photo"
              style={{ width: 180, height: 180 }}
              onError={() => setImg(FALLBACK)}
            />
          </div>
          <div className="col-lg-8">
            <Link to="/doctors" className="text-sm text-muted">
              ← Kthehu te mjekët
            </Link>
            <h2 className="mb-3 mt-2">{doc.fullName}</h2>
            <p className="text-primary font-weight-bold">{doc.specialty}</p>
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
            {doc.bio ? <p className="mt-3">{doc.bio}</p> : null}
            <Link to={`/appointment?doctorId=${doc.id}`} className="btn btn-main mt-3 btn-round-full">
              Rezervo terminin
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
