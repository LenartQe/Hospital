import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, Activity, Pill } from "lucide-react";
import { hospitalApi, parseApiError } from "api/hospitalApi";
import DoctorPortalLayout from "./DoctorPortalLayout";
import PageHeader from "./components/PageHeader";
import MedicalCard from "./components/MedicalCard";
import PatientAvatar from "./components/PatientAvatar";
import PrimaryButton from "./components/PrimaryButton";
import FormField from "./components/FormField";

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
    setMsg(`Pacienti u zgjodh. Mund të shtoni diagnozë ose recetë.`);
    setError("");
  };

  const submitDiagnosis = () => {
    if (!patientId || !dxTitle) return;
    hospitalApi.doctor
      .addDiagnosis(patientId, { title: dxTitle, description: dxDesc, severity: "MODERATE" })
      .then(() => {
        setMsg("Diagnoza u ruajt.");
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
      .then(() => {
        setMsg("Receta u ruajt.");
        setDosage("");
        setFrequency("");
        setError("");
      })
      .catch((e) => setError(parseApiError(e)));
  };

  const selectedPatient = patients.find((p) => String(p.id) === String(patientId));

  const patientOptions = [
    { value: "", label: "Zgjidhni pacientin..." },
    ...patients.map((p) => ({ value: String(p.id), label: p.fullName })),
  ];

  const medicineOptions = [
    { value: "", label: "Zgjidhni barnën..." },
    ...medicines.map((m) => ({ value: String(m.id), label: m.name })),
  ];

  return (
    <DoctorPortalLayout pageTitle="Pacientët">
      <PageHeader
        title="Pacientët"
        subtitle="Pacientët që kanë rezervuar termin me ju — klikoni për të zgjedhur"
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
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Pacienti i zgjedhur: <strong>{selectedPatient.fullName}</strong>
          {selectedPatient.email ? ` (${selectedPatient.email})` : ""}
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
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPatient(p.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                        selected
                          ? "border-blue-300 bg-blue-50 ring-2 ring-blue-500/30"
                          : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <PatientAvatar name={p.fullName} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">{p.fullName}</p>
                        {p.email ? (
                          <span className="mt-0.5 inline-block truncate rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            {p.email}
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

          <MedicalCard title="Përshkruaj barnë" icon={Pill}>
            <FormField
              label="Barna"
              as="select"
              value={medId}
              onChange={(e) => setMedId(e.target.value)}
              options={medicineOptions}
            />
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
