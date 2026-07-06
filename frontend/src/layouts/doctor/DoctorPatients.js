import { useEffect, useState } from "react";
import { Users, Activity, Pill } from "lucide-react";
import { hospitalApi } from "api/hospitalApi";
import DoctorPortalLayout from "./DoctorPortalLayout";
import PageHeader from "./components/PageHeader";
import MedicalCard from "./components/MedicalCard";
import PatientAvatar from "./components/PatientAvatar";
import PrimaryButton from "./components/PrimaryButton";
import FormField from "./components/FormField";

export default function DoctorPatients() {
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
      .catch((e) => setError(String(e.message)));
    hospitalApi.medicines
      .list()
      .then(setMedicines)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

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
      .catch((e) => setError(String(e.message)));
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
      .catch((e) => setError(String(e.message)));
  };

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
        subtitle="Zgjidhni pacientin dhe shtoni diagnoza ose receta"
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

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Patient list */}
        <div className="lg:col-span-2">
          <MedicalCard title="Lista e pacientëve" icon={Users}>
            <div className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
              {patients.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Nuk ka pacientë të regjistruar.
                </p>
              ) : (
                patients.map((p) => {
                  const selected = String(patientId) === String(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
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
                      <PrimaryButton
                        variant={selected ? "primary" : "ghost"}
                        className="!px-3 !py-1.5 text-xs"
                        onClick={() => setPatientId(String(p.id))}
                      >
                        Zgjidh
                      </PrimaryButton>
                    </div>
                  );
                })
              )}
            </div>
          </MedicalCard>
        </div>

        {/* Forms */}
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
            <PrimaryButton onClick={submitDiagnosis}>RUAJ DIAGNOZË</PrimaryButton>
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
            <PrimaryButton variant="success" onClick={submitPrescription}>
              RUAJ RECETËN
            </PrimaryButton>
          </MedicalCard>
        </div>
      </div>
    </DoctorPortalLayout>
  );
}
