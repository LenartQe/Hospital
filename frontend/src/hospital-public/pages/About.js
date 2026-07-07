import { Link } from "react-router-dom";
import FallbackImage from "../components/FallbackImage";
import { HOSPITAL_EXTERIOR, SERVICE_IMAGES } from "../hospitalImages";

const IMG_TEAM =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&h=600&fit=crop";
const IMG_TECH =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=600&fit=crop";

export default function About() {
  return (
    <>
      <section className="section hospital-page-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="section-title mb-4">
                <h2 className="text-md text-uppercase letter-spacing mb-1">Rreth nesh</h2>
                <div className="divider mb-4" />
              </div>
              <p className="lead mb-4">
                Spitali i Prizrenit ofron kujdes shëndetësor të integruar për qytetarët e
                Prizrenit dhe rajonit — nga emergjenca 24/7 deri te konsultimet specialistike dhe
                menaxhimi ditor i termineve në internet.
              </p>
              <p>
                Platforma jonë digjitale lidh faqen publike me panelet e mjekëve dhe pacientëve:
                terminet, diagnozat, recetat dhe faturat janë të sinkronizuara në kohë reale.
              </p>
            </div>
            <div className="col-lg-6">
              <FallbackImage
                sources={[HOSPITAL_EXTERIOR, IMG_TECH]}
                alt="Spitali i Prizrenit — ndërtesa kryesore"
                className="hospital-content-img hospital-about-hero-img rounded"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section gray-bg">
        <div className="container">
          <div className="row text-center mb-4">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="hospital-stat-card">
                <h3 className="hospital-stat-card__num">15+</h3>
                <p>Vite përvojë në shërbimin shëndetësor lokal</p>
              </div>
            </div>
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="hospital-stat-card">
                <h3 className="hospital-stat-card__num">6</h3>
                <p>Departamente kryesore me mjekë specialistë</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="hospital-stat-card">
                <h3 className="hospital-stat-card__num">24/7</h3>
                <p>Emergjencë dhe mbështetje për pacientët</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 text-center">
              <h3 className="mb-2">Barnatorja &amp; Diagnostika</h3>
              <p className="text-muted mb-0">
                Dy shërbime që lidhin vizitën te mjeku me trajtimin e vazhdueshëm të pacientit.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <article className="hospital-about-service-card h-100">
                <FallbackImage
                  sources={SERVICE_IMAGES.Barnatorja}
                  alt="Barnatorja — barnë"
                  className="hospital-about-service-card__img"
                />
                <div className="hospital-about-service-card__body">
                  <h4 className="mb-2">
                    <i className="icofont-drug hospital-service-detail__icon mr-2" />
                    Barnatorja
                  </h4>
                  <p className="mb-0">
                    Dispensim i barnave sipas recetës — çmimet dhe stoku janë të lidhura me
                    portalin e pacientit dhe faturën e pagesës.
                  </p>
                </div>
              </article>
            </div>
            <div className="col-lg-6">
              <article className="hospital-about-service-card h-100">
                <FallbackImage
                  sources={SERVICE_IMAGES.Diagnostika}
                  alt="Diagnostika — mjek duke shkruar"
                  className="hospital-about-service-card__img"
                />
                <div className="hospital-about-service-card__body">
                  <h4 className="mb-2">
                    <i className="icofont-laboratory hospital-service-detail__icon mr-2" />
                    Diagnostika
                  </h4>
                  <p className="mb-0">
                    Analiza laboratorike dhe dokumentim i rezultateve — mjeku regjistron gjetjet
                    direkt në kartelën tuaj digjitale.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 order-lg-2 mb-4 mb-lg-0">
              <FallbackImage
                sources={[IMG_TEAM, HOSPITAL_EXTERIOR]}
                alt="Ekipi mjekësor"
                className="hospital-content-img rounded"
              />
            </div>
            <div className="col-lg-6 order-lg-1">
              <h3 className="mb-3">Misioni ynë</h3>
              <p>
                Të ofrojmë trajtim të sigurt, të shpejtë dhe të qasshëm për çdo pacient. Stafi ynë
                mjekësor punon me standarde evropiane, ndërsa pacientët mund të ndjekin historinë e
                tyre mjekësore, barnat e përshkruara dhe faturat nga portali personal.
              </p>
              <ul className="hospital-check-list">
                <li>Konsultime me mjekë të certifikuar</li>
                <li>Rezervim termini online pa pritje në recepsion</li>
                <li>Diagnoza dhe receta të lidhura me llogarinë tuaj</li>
              </ul>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <FallbackImage
                sources={[IMG_TECH, HOSPITAL_EXTERIOR]}
                alt="Teknologji mjekësore"
                className="hospital-content-img rounded"
              />
            </div>
            <div className="col-lg-6">
              <h3 className="mb-3">Teknologji &amp; transparencë</h3>
              <p>
                Sistemi i integruar i spitalit menaxhon stokun e barnave, terminet e mjekëve dhe
                raportet e departamenteve. Pacientët shohin vetëm informacionin e tyre — diagnozat,
                barnat dhe pagesat — të lidhura me mjekun që kanë zgjedhur.
              </p>
              <Link to="/appointment" className="btn btn-main btn-round-full mt-2">
                Rezervo termin tani
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
