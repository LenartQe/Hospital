import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_MAILTO,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "../contactInfo";

export default function Contact() {
  const telHref = `tel:${CONTACT_PHONE_TEL.replace(/\s/g, "")}`;
  return (
    <section className="section contact">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="section-title text-center">
              <h2 className="text-md text-uppercase letter-spacing mb-1">Kontakti</h2>
              <div className="divider mx-auto mb-4" />
            </div>
            <p>Për emergjenca mjekësore telefononi shërbimin e emergjencës. Për pyetje të përgjithshme:</p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={CONTACT_EMAIL_MAILTO}>{CONTACT_EMAIL}</a>
            </p>
            <p>
              <strong>Telefoni:</strong>{" "}
              <a href={telHref}>{CONTACT_PHONE_DISPLAY}</a>
            </p>
            <p>
              <strong>Adresa:</strong> Prizren, Kosovë — për lokacionet brenda spitalit shihni faqet e
              departamenteve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
