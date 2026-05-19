import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";

export default function Departments() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    hospitalApi.departments
      .list()
      .then(setItems)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-danger">
            Nuk u ngarkuan departamentet. A është API aktiv? ({err})
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section department">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="section-title text-center">
              <h2 className="text-md text-uppercase letter-spacing mb-1">Departamentet</h2>
              <div className="divider mx-auto mb-4" />
            </div>
          </div>
        </div>
        <div className="row">
          {items.map((d) => (
            <div key={d.id} className="col-lg-4 col-md-6">
              <div className="department-block mb-5 mb-lg-0">
                <h4 className="mb-3">{d.name}</h4>
                <p>{d.description || "—"}</p>
                <p className="text-sm text-muted">{d.location}</p>
                <Link to={`/departments/${d.id}`} className="read-more">
                  Më shumë <i className="icofont-simple-right ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
