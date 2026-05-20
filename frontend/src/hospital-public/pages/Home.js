import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-xl-7">
              <div className="block">
                <div className="divider mb-3" />
                <span className="text-uppercase text-sm letter-spacing">
                  Kujdes shëndetësor i plotë
                </span>
                <h1 className="mb-3 mt-3">Partneri juaj i besuar për shëndetin</h1>
                <p className="mb-4 pr-5">
                  Menaxhim gjithëpërfshirës spitalor: departamente, staf mjekësor, stoku i
                  barnatorës dhe planifikimi i termineve — i lidhur me panelin modern të
                  administrimit.
                </p>
                <div className="btn-container">
                  <Link to="/appointment" className="btn btn-main-2 btn-icon btn-round-full">
                    Rezervo terminin <i className="icofont-simple-right ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="features">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="feature-block d-lg-flex">
                <div className="feature-item mb-5 mb-lg-0">
                  <div className="feature-icon mb-4">
                    <i className="icofont-surgeon-alt" />
                  </div>
                  <span>Shërbim 24 orë</span>
                  <h4 className="mb-3">Terminet në internet</h4>
                  <p className="mb-4">Kërkoni vizitë te mjeku nga lista jonë e përditësuar.</p>
                  <Link to="/appointment" className="btn btn-main btn-round-full">
                    Rezervo tani
                  </Link>
                </div>
                <div className="feature-item mb-5 mb-lg-0">
                  <div className="feature-icon mb-4">
                    <i className="icofont-ui-clock" />
                  </div>
                  <span>Orari</span>
                  <h4 className="mb-3">Orari i punës</h4>
                  <ul className="w-hours list-unstyled">
                    <li className="d-flex justify-content-between">
                      Hën - Pre : <span>8:00 - 18:00</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      Sht : <span>9:00 - 14:00</span>
                    </li>
                  </ul>
                </div>
                <div className="feature-item mb-5 mb-lg-0">
                  <div className="feature-icon mb-4">
                    <i className="icofont-heart-beat-alt" />
                  </div>
                  <span>Ekipe klinike</span>
                  <h4 className="mb-3">Departamentet</h4>
                  <p className="mb-4">Shfletoni specialitetet dhe konsulentët.</p>
                  <Link to="/departments" className="btn btn-main btn-round-full">
                    Shiko departamentet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
