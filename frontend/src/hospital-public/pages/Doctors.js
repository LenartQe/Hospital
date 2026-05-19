import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";

export default function Doctors() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    hospitalApi.doctors
      .list()
      .then(setItems)
      .catch((e) => setErr(e.message));
  }, []);

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
    <section className="section doctor">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="section-title text-center">
              <h2 className="text-md text-uppercase letter-spacing mb-1">Mjekët</h2>
              <div className="divider mx-auto mb-4" />
            </div>
          </div>
        </div>
        <div className="row">
          {items.map((doc) => (
            <div key={doc.id} className="col-lg-4 col-sm-6 col-md-6 mb-4">
              <div className="doctor-block">
                <div className="content text-center">
                  <h4 className="mt-4 mb-0">
                    <Link to={`/doctors/${doc.id}`} className="text-dark">
                      {doc.fullName}
                    </Link>
                  </h4>
                  <p>{doc.specialty}</p>
                  <p className="text-sm">{doc.department?.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
