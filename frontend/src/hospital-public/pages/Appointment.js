import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { hospitalApi } from "api/hospitalApi";
import { DOCTOR_PFP_FALLBACK, doctorPhoto } from "../hospitalImages";

const STEPS = [
  { num: 1, title: "Të dhënat tuaja", desc: "Emri, kontakti dhe data e preferuar." },
  { num: 2, title: "Zgjidhni mjekun", desc: "Specialisti që dëshironi të vizitoni." },
  { num: 3, title: "Konfirmimi", desc: "Stafi konfirmon terminin brenda 24 orëve." },
];

function dedupeDoctors(list) {
  const byEmail = new Map();
  list.forEach((d) => {
    const key = (d.email || `id-${d.id}`).toLowerCase();
    if (!byEmail.has(key)) byEmail.set(key, d);
  });
  return [...byEmail.values()].sort((a, b) =>
    (a.fullName || "").localeCompare(b.fullName || "", "sq")
  );
}

function DoctorPreview({ doctor }) {
  const [img, setImg] = useState(doctorPhoto(doctor));

  useEffect(() => {
    setImg(doctorPhoto(doctor));
  }, [doctor]);

  if (!doctor) return null;

  return (
    <div className="hospital-appointment-doctor">
      <img
        src={img}
        alt={doctor.fullName}
        className="hospital-appointment-doctor__photo"
        onError={() => setImg(DOCTOR_PFP_FALLBACK)}
      />
      <div>
        <strong>{doctor.fullName}</strong>
        <p className="mb-1 text-muted small">{doctor.specialty || doctor.specialization}</p>
        <p className="mb-0 text-muted small">{doctor.department?.name}</p>
      </div>
    </div>
  );
}

export default function Appointment() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    patientName: "",
    email: "",
    phone: "",
    preferredDate: "",
    message: "",
    doctorId: "",
  });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const selectedDoctor = useMemo(
    () => doctors.find((d) => String(d.id) === String(form.doctorId)),
    [doctors, form.doctorId]
  );

  useEffect(() => {
    hospitalApi.doctors
      .list()
      .then((list) => {
        const unique = dedupeDoctors(list);
        setDoctors(unique);
        const fromUrl = searchParams.get("doctorId");
        const initial =
          fromUrl && unique.some((d) => String(d.id) === String(fromUrl))
            ? fromUrl
            : unique[0]
              ? String(unique[0].id)
              : "";
        if (initial) setForm((f) => ({ ...f, doctorId: initial }));
      })
      .catch(() => setErr("Nuk u ngarkuan mjekët."))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const submit = (e) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    hospitalApi.appointments
      .create({
        patientName: form.patientName,
        email: form.email,
        phone: form.phone,
        preferredDate: form.preferredDate || null,
        message: form.message,
        doctorId: Number(form.doctorId),
      })
      .then(() => {
        setMsg("Kërkesa për termin u dërgua. Stafi ynë do t'ju konfirmojë së shpejti.");
        setForm((f) => ({ ...f, patientName: "", email: "", phone: "", message: "", preferredDate: "" }));
      })
      .catch((e) => setErr(e.message));
  };

  return (
    <section className="section hospital-appointment-page gray-bg">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div className="section-title text-center">
              <h2 className="text-md text-uppercase letter-spacing mb-1">Rezervo terminin</h2>
              <div className="divider mx-auto mb-4" />
              <p className="text-muted mb-0">
                Plotësoni formularin më poshtë — mjeku ose recepsioni do t'ju kontaktojë për
                konfirmimin e orarit.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div className="hospital-appointment-info h-100">
              <h4 className="mb-4">Si funksionon?</h4>
              <ol className="hospital-appointment-steps">
                {STEPS.map((s) => (
                  <li key={s.num} className="hospital-appointment-steps__item">
                    <span className="hospital-appointment-steps__num">{s.num}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <p className="mb-0 small text-muted">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="hospital-appointment-note mt-4">
                <i className="icofont-info-circle mr-2" />
                Terminet e konfirmuara shfaqen në portalin e pacientit. Mund të kërkoni edhe
                ndryshim date duke na kontaktuar.
              </div>

              <ul className="hospital-check-list mt-4 mb-4">
                <li>Pa pagesë për rezervimin online</li>
                <li>Zgjedhje e lirë e mjekut specialist</li>
                <li>Konfirmim nga stafi brenda 24 orëve</li>
              </ul>

              <Link to="/doctors" className="hospital-appointment-link">
                Shiko të gjithë mjekët <i className="icofont-simple-right ml-1" />
              </Link>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="hospital-appointment-form-card">
              {msg && <div className="alert alert-success">{msg}</div>}
              {err && <div className="alert alert-danger">{err}</div>}

              {selectedDoctor && <DoctorPreview doctor={selectedDoctor} />}

              {loading ? (
                <p className="text-muted">Duke u ngarkuar mjekët…</p>
              ) : (
                <form className="hospital-appointment-form" onSubmit={submit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          <i className="icofont-user-alt-3 mr-1" />
                          Emri i plotë *
                        </label>
                        <input
                          className="form-control"
                          required
                          placeholder="Emri dhe mbiemri"
                          value={form.patientName}
                          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          <i className="icofont-ui-calendar mr-1" />
                          Data e preferuar
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={form.preferredDate}
                          onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          <i className="icofont-email mr-1" />
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="email@shembull.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>
                          <i className="icofont-phone mr-1" />
                          Telefoni
                        </label>
                        <input
                          className="form-control"
                          placeholder="+383 …"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="icofont-doctor mr-1" />
                      Mjeku *
                    </label>
                    <select
                      className="form-control"
                      required
                      value={form.doctorId}
                      onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.fullName} — {d.specialty || d.specialization}
                          {d.department?.name ? ` (${d.department.name})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      <i className="icofont-comment mr-1" />
                      Mesazhi / simptomat
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Përshkruani shkurt arsyen e vizitës ose simptomat kryesore…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-main btn-round-full btn-block" disabled={!form.doctorId}>
                    Dërgo kërkesën për termin
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
