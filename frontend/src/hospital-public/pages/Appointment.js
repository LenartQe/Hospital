import { useEffect, useState } from "react";
import { hospitalApi } from "api/hospitalApi";

export default function Appointment() {
  const [doctors, setDoctors] = useState([]);
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

  useEffect(() => {
    hospitalApi.doctors
      .list()
      .then((list) => {
        setDoctors(list);
        if (list[0]) setForm((f) => ({ ...f, doctorId: String(list[0].id) }));
      })
      .catch(() => setErr("Nuk u ngarkuan mjekët."));
  }, []);

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
        setForm((f) => ({ ...f, patientName: "", message: "" }));
      })
      .catch((e) => setErr(e.message));
  };

  return (
    <section className="section appoinment">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-title text-center">
              <h2 className="text-md text-uppercase letter-spacing mb-1">Rezervo terminin</h2>
              <div className="divider mx-auto mb-4" />
            </div>
            {msg && <div className="alert alert-success">{msg}</div>}
            {err && <div className="alert alert-danger">{err}</div>}
            <form className="appoinment-form" onSubmit={submit}>
              <div className="form-group">
                <label>Emri i plotë *</label>
                <input
                  className="form-control"
                  required
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Telefoni</label>
                <input
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Data e preferuar</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.preferredDate}
                  onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Mjeku *</label>
                <select
                  className="form-control"
                  required
                  value={form.doctorId}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} — {d.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Mesazhi</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-main btn-round-full">
                Dërgo
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
