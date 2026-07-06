import { useEffect, useState } from "react";
import { CalendarDays, Mail, Phone, Check, X } from "lucide-react";
import { hospitalApi } from "api/hospitalApi";
import DoctorPortalLayout from "./DoctorPortalLayout";
import PageHeader from "./components/PageHeader";
import StatusBadge from "./components/StatusBadge";
import EmptyState from "./components/EmptyState";
import PatientAvatar from "./components/PatientAvatar";
import PrimaryButton from "./components/PrimaryButton";

export default function DoctorAppointments() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    hospitalApi.doctor
      .appointments()
      .then(setRows)
      .catch((e) => setError(String(e.message)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = (id, status) => {
    hospitalApi.doctor
      .updateAppointmentStatus(id, status)
      .then(load)
      .catch((e) => setError(String(e.message)));
  };

  return (
    <DoctorPortalLayout pageTitle="Terminet e mia">
      <PageHeader
        title="Terminet e mia"
        subtitle="Menaxhoni dhe konfirmoni terminet e pacientëve"
        icon={CalendarDays}
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
          icon={CalendarDays}
          title="Nuk ka termine të regjistruara për ju"
          description="Kur pacientët rezervojnë termine, ato do të shfaqen këtu për menaxhim."
        />
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-4 lg:hidden">
            {rows.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card"
              >
                <div className="mb-3 flex items-center gap-3">
                  <PatientAvatar name={r.patientName} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{r.patientName}</p>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
                <div className="mb-3 space-y-1.5 text-sm text-slate-600">
                  {r.email ? (
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      {r.email}
                    </p>
                  ) : null}
                  {r.phone ? (
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {r.phone}
                    </p>
                  ) : null}
                  <p className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-slate-400" />
                    {r.preferredDate || "—"}
                  </p>
                  {r.message ? (
                    <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-500">{r.message}</p>
                  ) : null}
                </div>
                {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                  <div className="flex gap-2">
                    {r.status === "PENDING" ? (
                      <PrimaryButton
                        variant="success"
                        className="flex-1 text-xs"
                        onClick={() => changeStatus(r.id, "CONFIRMED")}
                      >
                        <Check size={14} />
                        Prano
                      </PrimaryButton>
                    ) : null}
                    <PrimaryButton
                      variant="danger"
                      className="flex-1 text-xs"
                      onClick={() => changeStatus(r.id, "CANCELLED")}
                    >
                      <X size={14} />
                      Anulo
                    </PrimaryButton>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Pacienti</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Email</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Telefoni</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Data e preferuar</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Mesazhi</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Statusi</th>
                  <th className="px-5 py-3.5 font-semibold text-slate-600">Veprime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <PatientAvatar name={r.patientName} size="sm" />
                        <span className="font-medium text-slate-900">{r.patientName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{r.email || "—"}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-600">{r.phone || "—"}</td>
                    <td className="px-5 py-4 text-slate-600">{r.preferredDate || "—"}</td>
                    <td className="max-w-xs truncate px-5 py-4 text-slate-500">
                      {r.message || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {r.status === "PENDING" ? (
                          <PrimaryButton
                            variant="success"
                            className="!px-3 !py-1.5 text-xs"
                            onClick={() => changeStatus(r.id, "CONFIRMED")}
                          >
                            <Check size={14} />
                            Prano
                          </PrimaryButton>
                        ) : null}
                        {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                          <PrimaryButton
                            variant="danger"
                            className="!px-3 !py-1.5 text-xs"
                            onClick={() => changeStatus(r.id, "CANCELLED")}
                          >
                            <X size={14} />
                            Anulo
                          </PrimaryButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DoctorPortalLayout>
  );
}
