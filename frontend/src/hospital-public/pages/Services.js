export default function Services() {
  return (
    <section className="section service gray-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="section-title text-center">
              <h2 className="text-md text-uppercase letter-spacing mb-1">Shërbimet</h2>
              <div className="divider mx-auto mb-4" />
            </div>
          </div>
        </div>
        <div className="row">
          {[
            { t: "Ambulanca", d: "Konsultime dhe vizita pasuese." },
            { t: "Emergjenca", d: "Triage dhe ekipe në thirrje." },
            { t: "Barnatorja", d: "Stoku i ndjekur në panelin e administrimit." },
            { t: "Diagnostika", d: "Referime të koordinuara ndërmjet departamenteve." },
          ].map((s) => (
            <div key={s.t} className="col-lg-3 col-md-6 col-sm-6">
              <div className="service-block mb-4 mb-lg-0">
                <h4 className="mb-3">{s.t}</h4>
                <p>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
