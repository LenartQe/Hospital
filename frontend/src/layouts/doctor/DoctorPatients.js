import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, Activity, Pill, UserX, Check, Ban, CalendarDays } from "lucide-react";
import { hospitalApi, parseApiError } from "api/hospitalApi";
import DoctorPortalLayout from "./DoctorPortalLayout";
import PageHeader from "./components/PageHeader";
import MedicalCard from "./components/MedicalCard";
import PatientAvatar from "./components/PatientAvatar";
import PrimaryButton from "./components/PrimaryButton";
import FormField from "./components/FormField";
import StatusBadge from "./components/StatusBadge";

export default function DoctorPatients() {
  const [searchParams] = useSearchParams();
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [dxTitle, setDxTitle] = useState("");
  const [dxDesc, setDxDesc] = useState("");
  const [medId, setMedId] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    hospitalApi.doctor
      .patients()
      .then(setPatients)
      .catch((e) => setError(parseApiError(e)));
    hospitalApi.doctor
      .medicines()
      .then(setMedicines)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const fromQuery = searchParams.get("patientId");
    if (fromQuery) {
      setPatientId(fromQuery);
    }
  }, [searchParams]);

  const selectPatient = (id) => {
    setPatientId(String(id));
    setMsg("Pacienti u zgjodh. Konfirmoni terminin, pastaj shtoni diagnozë ose recetë.");
    setError("");
  };

  const changeAppointmentStatus = (appointmentId, status) => {
    hospitalApi.doctor
      .updateAppointmentStatus(appointmentId, status)
      .then(() => {
        setMsg(status === "CONFIRMED" ? "Termini u konfirmua." : "Termini u refuzua.");
        setError("");
        load();
      })
      .catch((e) => setError(parseApiError(e)));
  };

  const submitDiagnosis = () => {
    if (!patientId || !dxTitle) return;
    hospitalApi.doctor
      .addDiagnosis(patientId, { title: dxTitle, description: dxDesc, severity: "MODERATE" })
      .then(() => {
        setMsg("Diagnoza u ruajt. Pacienti e sheh në portalin e tyre.");
        setDxTitle("");
        setDxDesc("");
        setError("");
      })
      .catch((e) => setError(parseApiError(e)));
  };

  const submitPrescription = () => {
    if (!patientId || !medId || !dosage) return;
    hospitalApi.doctor
      .addPrescription(patientId, {
        medicineId: Number(medId),
        dosage,
        frequency,
        instructions: "",
      })
      .then((saved) => {
        setMsg(`Receta u ruajt: ${saved.medicineName || "barna"}. Pacienti e sheh te Barnat dhe Fatura.`);
        setMedId("");
        setDosage("");
        setFrequency("");
        setError("");
      })
      .catch((e) => setError(parseApiError(e)));
  };

  const removePatient = (id) => {
    if (
      !window.confirm(
        "Të hiqet ky pacient nga lista juaj? Terminet e tyre do të fshihen nga Terminet e mia."
      )
    ) {
      return;
    }
    hospitalApi.doctor
      .hidePatient(id)
      .then(() => {
        if (String(patientId) === String(id)) {
          setPatientId("");
        }
        setMsg("Pacienti u hoq dhe terminet u fshinë.");
        setError("");
        load();
      })
      .catch((e) => setError(parseApiError(e)));
  };

  const selectedPatient = patients.find((p) => String(p.id) === String(patientId));
  const selectedAppointments = selectedPatient?.appointments || [];
  const pendingAppointments = selectedAppointments.filter((a) => a.status === "PENDING");

  const patientOptions = [
    { value: "", label: "Zgjidhni pacientin..." },
    ...patients.map((p) => ({ value: String(p.id), label: p.fullName })),
  ];

  const medicineOptions = [
    { value: "", label: "Zgjidhni barnën..." },
    ...medicines.map((m) => ({ value: String(m.id), label: `${m.name} (${m.price ?? 0}€)` })),
  ];

  return (
    <DoctorPortalLayout pageTitle="Pacientët">
      <PageHeader
        title="Pacientët"
        subtitle="Pacientët që kanë rezervuar termin me ju — konfirmoni, diagnozoni, përshkruani barna"
        icon={Users}
      />

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {msg ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {msg}
        </div>
      ) : null}

      {selectedPatient ? (
        <div className="mb-4 space-y-3">
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Pacienti i zgjedhur: <strong>{selectedPatient.fullName}</strong>
            {selectedPatient.email ? ` (${selectedPatient.email})` : ""}
          </div>
          {pendingAppointments.length > 0 ? (
            <MedicalCard title="Konfirmo terminin" icon={CalendarDays}>
              {pendingAppointments.map((a) => (
                <div
                  key={a.id}
                  className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3 last:mb-0"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {a.preferredDate || "Data e papërcaktuar"}
                    </p>
                    <p className="text-xs text-slate-500">{a.message || "Pa mesazh"}</p>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="flex gap-2">
                    <PrimaryButton
                      variant="success"
                      className="!px-3 !py-1.5 text-xs"
                      onClick={() => changeAppointmentStatus(a.id, "CONFIRMED")}
                    >
                      <Check size={14} />
                      Prano
                    </PrimaryButton>
                    <PrimaryButton
                      variant="danger"
                      className="!px-3 !py-1.5 text-xs"
                      onClick={() => changeAppointmentStatus(a.id, "REJECTED")}
                    >
                      <Ban size={14} />
                      Refuzo
                    </PrimaryButton>
                  </div>
                </div>
              ))}
            </MedicalCard>
          ) : selectedAppointments.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              Terminet:{" "}
              {selectedAppointments.map((a) => (
                <span key={a.id} className="mr-2 inline-flex items-center gap-1">
                  {a.preferredDate || "—"} <StatusBadge status={a.status} />
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <MedicalCard title="Pacientët e mi (nga terminet)" icon={Users}>
            <div className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
              {patients.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Nuk ka pacientë me termine të regjistruara për ju ende.
                </p>
              ) : (
                patients.map((p) => {
                  const selected = String(patientId) === String(p.id);
                  const pending = (p.appointments || []).filter((a) => a.status === "PENDING").length;
                  return (
                    <div
                      key={p.id}
                      className={`flex w-full items-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
                        selected
                          ? "border-blue-300 bg-blue-50 ring-2 ring-blue-500/30"
                          : "border-slate-100 bg-slate-50/50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => selectPatient(p.id)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left hover:opacity-90"
                      >
                        <PatientAvatar name={p.fullName} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-900">{p.fullName}</p>
                          {p.email ? (
                            <span className="mt-0.5 inline-block truncate rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                              {p.email}
                            </span>
                          ) : null}
                          {pending > 0 ? (
                            <span className="mt-1 inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                              {pending} termin në pritje
                            </span>
                          ) : null}
                        </div>
                        <span
                          className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                            selected ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {selected ? "Zgjedhur" : "Zgjidh"}
                        </span>
                      </button>
                      <button
                        type="button"
                        title="Hiq nga lista"
                        onClick={() => removePatient(p.id)}
                        className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                      >
                        <UserX size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </MedicalCard>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <MedicalCard title="Shto diagnozë" icon={Activity}>
            <FormField
              label="Pacienti"
              as="select"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              options={patientOptions}
            />
            <FormField
              label="Titulli i diagnozës"
              value={dxTitle}
              onChange={(e) => setDxTitle(e.target.value)}
              placeholder="p.sh. Hipertension arterial"
            />
            <FormField
              label="Përshkrimi"
              as="textarea"
              value={dxDesc}
              onChange={(e) => setDxDesc(e.target.value)}
              placeholder="Përshkrimi i detajuar i diagnozës..."
              rows={4}
            />
            <PrimaryButton onClick={submitDiagnosis} disabled={!patientId || !dxTitle}>
              RUAJ DIAGNOZË
            </PrimaryButton>
          </MedicalCard>

          <MedicalCard title="Përshkruaj barnë (Recetë)" icon={Pill}>
            <FormField
              label="Pacienti"
              as="select"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              options={patientOptions}
            />
            <FormField
              label="Barna"
              as="select"
              value={medId}
              onChange={(e) => setMedId(e.target.value)}
              options={medicineOptions}
            />
            {medicines.length === 0 ? (
              <p className="mb-3 text-sm text-amber-700">
                Nuk u ngarkuan barnat për specialitetin tuaj. Rinisni backend-in.
              </p>
            ) : null}
            <FormField
              label="Doza"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="p.sh. 500mg"
            />
            <FormField
              label="Frekuenca"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="p.sh. 2 herë në ditë"
            />
            <PrimaryButton
              variant="success"
              onClick={submitPrescription}
              disabled={!patientId || !medId || !dosage}
            >
              RUAJ RECETËN
            </PrimaryButton>
          </MedicalCard>
        </div>
      </div>
    </DoctorPortalLayout>
  );
}
