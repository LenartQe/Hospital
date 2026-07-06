import { useEffect, useState } from "react";
import { Pill, Calendar, User } from "lucide-react";
import { hospitalApi, parseApiError } from "api/hospitalApi";
import DoctorPortalLayout from "./DoctorPortalLayout";
import PageHeader from "./components/PageHeader";
import StatusBadge from "./components/StatusBadge";
import EmptyState from "./components/EmptyState";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DoctorPrescriptions() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalApi.doctor
      .prescriptions()
      .then(setRows)
      .catch((e) => setError(parseApiError(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DoctorPortalLayout pageTitle="Recetat e mia">
      <PageHeader
        title="Recetat e mia"
        subtitle="Regjistri dixhital i recetave të shkruara"
        icon={Pill}
      />

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : !rows.length ? (
        <EmptyState
          icon={Pill}
          title="Nuk keni receta të regjistruara"
          description="Recetat që përshkruani te pacientët do të shfaqen këtu."
        />
      ) : (
        <div className="space-y-4">
          {rows.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Pill size={20} />
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{p.medicineName}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                        Doza: {p.dosage}
                      </span>
                      {p.frequency ? (
                        <span className="rounded-lg bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                          Frekuenca: {p.frequency}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} className="text-slate-400" />
                  {p.patientName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDate(p.prescribedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DoctorPortalLayout>
  );
}
