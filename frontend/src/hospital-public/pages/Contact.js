import { Link } from "react-router-dom";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_MAILTO,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "../contactInfo";
import "../hospital-site.css";

const IMG_BUILDING =
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&h=600&fit=crop";
const IMG_RECEPTION =
  "https://images.unsplash.com/photo-1586773866418-d27a676df198?w=800&h=500&fit=crop";

export default function Contact() {
  const telHref = `tel:${CONTACT_PHONE_TEL}`;

  return (
    <>
      <section className="section contact hospital-page-hero">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <div className="section-title text-center">
                <h2 className="text-md text-uppercase letter-spacing mb-1">Kontakti</h2>
                <div className="divider mx-auto mb-4" />
                <p>
                  Na kontaktoni për pyetje, termine ose informacion rreth departamenteve. Për
                  emergjenca mjekësore telefononi numrin e emergjencës menjëherë.
                </p>
              </div>
            </div>
          </div>

          <div className="row mb-5">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="hospital-contact-card h-100">
                <i className="icofont-ui-call hospital-contact-card__icon" />
                <h4>Telefoni</h4>
                <p>
                  <a href={telHref} className="hospital-phone-link">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </p>
                <p className="text-sm text-muted mb-0">Hën–Pre 08:00–18:00 · Sht 09:00–14:00</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="hospital-contact-card h-100">
                <i className="icofont-email hospital-contact-card__icon" />
                <h4>Email</h4>
                <p>
                  <a href={CONTACT_EMAIL_MAILTO}>{CONTACT_EMAIL}</a>
                </p>
                <p className="text-sm text-muted mb-0">Përgjigjemi brenda 24 orëve pune</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 mb-4">
              <div className="hospital-contact-card h-100">
                <i className="icofont-location-pin hospital-contact-card__icon" />
                <h4>Adresa</h4>
                <p className="mb-2">Rr. Spitalit, Prizren 20000, Kosovë</p>
                <Link to="/departments" className="text-sm">
                  Shiko lokacionet e departamenteve →
                </Link>
              </div>
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img src={IMG_BUILDING} alt="Ndërtesa e spitalit" className="hospital-content-img rounded mb-3" />
              <img src={IMG_RECEPTION} alt="Recepsioni" className="hospital-content-img rounded" />
            </div>
            <div className="col-lg-6">
              <h3 className="mb-3">Si të na gjeni</h3>
              <p>
                Spitali i Prizrenit ndodhet në qendër të qytetit me hyrje të qartë nga rruga kryesore.
                Recepsioni ju orienton drejt departamentit përkatës ose mjekut tuaj.
              </p>
              <ul className="hospital-check-list mb-4">
                <li>Parkim i disponueshëm për vizitorët</li>
                <li>Recepsion &amp; informacion për pacientët</li>
                <li>Terminet online përmes{" "}
                  <Link to="/appointment">faqes së rezervimit</Link>
                </li>
              </ul>
              <div className="hospital-emergency-banner">
                <strong>Emergjenca:</strong> Në rast urgjence mjekësore telefononi{" "}
                <a href={telHref}>{CONTACT_PHONE_DISPLAY}</a> ose shkoni direkt në departamentin e
                emergjencës.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
