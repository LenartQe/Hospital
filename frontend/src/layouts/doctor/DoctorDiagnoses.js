import { useEffect, useState } from "react";
import { Activity, Calendar, User } from "lucide-react";
import { hospitalApi, parseApiError } from "api/hospitalApi";
import DoctorPortalLayout from "./DoctorPortalLayout";
import PageHeader from "./components/PageHeader";
import EmptyState from "./components/EmptyState";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DoctorDiagnoses() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalApi.doctor
      .diagnoses()
      .then(setRows)
      .catch((e) => setError(parseApiError(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DoctorPortalLayout pageTitle="Diagnozat e mia">
      <PageHeader
        title="Diagnozat e mia"
        subtitle="Historia e diagnozave të shkruara nga ju"
        icon={Activity}
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
          icon={Activity}
          title="Nuk keni diagnoza të regjistruara"
          description="Diagnozat që shtoni te pacientët do të shfaqen këtu."
        />
      ) : (
        <div className="relative space-y-4">
          <div className="absolute bottom-0 left-6 top-0 hidden w-px bg-slate-200 md:block" />
          {rows.map((d) => (
            <div key={d.id} className="relative md:pl-14">
              <div className="absolute left-4 top-6 hidden h-4 w-4 rounded-full border-2 border-blue-500 bg-white md:block" />
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{d.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar size={14} className="text-blue-500" />
                    {formatDate(d.diagnosedAt)}
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <User size={12} />
                    {d.patientName}
                  </span>
                </div>
                {d.description ? (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                    {d.description}
                  </div>
                ) : (
                  <p className="text-sm italic text-slate-400">Pa përshkrim të detajuar.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DoctorPortalLayout>
  );
}
