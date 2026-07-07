import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";
import FallbackImage from "../components/FallbackImage";
import { deptVisual } from "../hospitalImages";

function DepartmentCard({ dept }) {
  const { images, icon, imageClass } = deptVisual(dept.name);
  const imgClass = ["hospital-dept-card__img", imageClass].filter(Boolean).join(" ");

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <article className="hospital-dept-card h-100">
        <div className="hospital-dept-card__media">
          <FallbackImage sources={images} alt={dept.name} className={imgClass} />
          <span className="hospital-dept-card__icon-badge">
            <i className={icon} />
          </span>
        </div>
        <div className="hospital-dept-card__body">
          <h4 className="hospital-dept-card__title mb-2">{dept.name}</h4>
          <p className="hospital-dept-card__desc">{dept.description || "Kujdes specialist në këtë fushë."}</p>
          {dept.location && (
            <p className="hospital-dept-card__location mb-3">
              <i className="icofont-location-pin mr-1" />
              {dept.location}
            </p>
          )}
          <Link to={`/departments/${dept.id}`} className="hospital-dept-card__link">
            Më shumë <i className="icofont-simple-right ml-1" />
          </Link>
        </div>
      </article>
    </div>
  );
}

export default function Departments() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalApi.departments
      .list()
      .then(setItems)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (err) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-danger">Nuk u ngarkuan departamentet. A është API aktiv? ({err})</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section department hospital-departments-page gray-bg">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div className="section-title text-center">
              <h2 className="text-md text-uppercase letter-spacing mb-1">Departamentet</h2>
              <div className="divider mx-auto mb-4" />
              <p className="text-muted">
                Ekipet tona specialistike ofrojnë kujdes të koordinuar — zgjidhni një departament
                për detaje dhe mjekët e lidhur.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted">Duke u ngarkuar…</p>
        ) : (
          <div className="row">
            {items.map((d) => (
              <DepartmentCard key={d.id} dept={d} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
