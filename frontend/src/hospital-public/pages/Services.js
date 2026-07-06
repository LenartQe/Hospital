const SERVICES = [
  {
    title: "Ambulanca",
    icon: "icofont-ambulance-cross",
    image: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=600&h=400&fit=crop",
    summary: "Transport dhe stabilizim i pacientit drejt spitalit.",
    details: [
      "Ekip i trajnuar me mjek dhe infermier në çdo mision",
      "Pajisje bazë monitorimi gjatë transportit",
      "Koordinim me emergjencën e spitalit para mbërritjes",
      "Disponueshmëri për raste urgjente brenda rajonit",
    ],
  },
  {
    title: "Emergjenca",
    icon: "icofont-heart-beat-alt",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop",
    summary: "Triage, stabilizim dhe trajtim i rasteve urgjente 24/7.",
    details: [
      "Pranim i pacientëve pa termin — prioritet sipas rrezikshmërisë",
      "Ekip multidisiplinor: mjekë, infermierë, laborator",
      "Lidhje e drejtpërdrejtë me Kardiologji, Neurologji dhe Kirurgji",
      "Regjistrim i vizitës në sistem për vazhdimësi të kujdesit",
    ],
  },
  {
    title: "Barnatorja",
    icon: "icofont-drug",
    image: "https://images.unsplash.com/photo-1587854691652-5c2515b4c952?w=600&h=400&fit=crop",
    summary: "Dispensim i barnave sipas recetës së mjekut tuaj.",
    details: [
      "Stok i monitoruar në kohë reale nga administrata",
      "Barna të përshkruara nga mjeku shfaqen në portalin e pacientit",
      "Çmimet e barnave reflektohen në faturën e pagesës online",
      "Këshillim farmaceutik për dozën dhe përdorimin e sigurt",
    ],
  },
  {
    title: "Diagnostika",
    icon: "icofont-laboratory",
    image: "https://images.unsplash.com/photo-1579154204601-01588a147a9f?w=600&h=400&fit=crop",
    summary: "Analiza laboratorike dhe referime ndër-departamentale.",
    details: [
      "Laborator me analiza të rutinës dhe të urgjencës",
      "Rezultatet lidhen me kartelën e pacientit në sistem",
      "Referime të koordinuara nga mjeku specialist",
      "Planifikim i vizitave pasuese nga portali i pacientit",
    ],
  },
];

export default function Services() {
  return (
    <section className="section service gray-bg hospital-services-page">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div className="section-title text-center">
              <h2 className="text-md text-uppercase letter-spacing mb-1">Shërbimet</h2>
              <div className="divider mx-auto mb-4" />
              <p className="text-muted">
                Katër shtyllat kryesore të kujdesit tonë — me detaje për çfarë përfshin secili
                shërbim.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {SERVICES.map((s) => (
            <div key={s.title} className="col-lg-6 mb-4">
              <article className="hospital-service-detail h-100">
                <img src={s.image} alt={s.title} className="hospital-service-detail__img" loading="lazy" />
                <div className="hospital-service-detail__body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className={`${s.icon} hospital-service-detail__icon`} />
                    <h4 className="mb-0">{s.title}</h4>
                  </div>
                  <p className="hospital-service-detail__summary">{s.summary}</p>
                  <ul className="hospital-check-list mb-0">
                    {s.details.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
