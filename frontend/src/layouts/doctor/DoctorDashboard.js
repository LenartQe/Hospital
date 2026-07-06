import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Activity,
  Pill,
  Clock,
  ArrowRight,
  Check,
  Ban,
} from "lucide-react";
import { hospitalApi, parseApiError } from "api/hospitalApi";
import DoctorPortalLayout from "./DoctorPortalLayout";
import PageHeader from "./components/PageHeader";
import StatusBadge from "./components/StatusBadge";
import MedicalCard from "./components/MedicalCard";
import PrimaryButton from "./components/PrimaryButton";

const SHORTCUTS = [
  {
    to: "/doctor/appointments",
    label: "Terminet",
    desc: "Konfirmo ose anulo",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
  },
  {
    to: "/doctor/patients",
    label: "Pacientët",
    desc: "Diagnoza dhe receta",
    icon: Users,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    to: "/doctor/diagnoses",
    label: "Diagnozat",
    desc: "Shiko historinë",
    icon: Activity,
    color: "bg-violet-50 text-violet-600",
  },
  {
    to: "/doctor/prescriptions",
    label: "Recetat",
    desc: "Regjistri i recetave",
    icon: Pill,
    color: "bg-amber-50 text-amber-600",
  },
];

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${color} transition-transform group-hover:scale-110`}
        >
          <Icon size={22} strokeWidth={1.75} />
        </span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string.isRequired,
};

export default function DoctorDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    hospitalApi.doctor
      .dashboard()
      .then(setData)
      .catch((e) => setError(parseApiError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = (id, status) => {
    hospitalApi.doctor
      .updateAppointmentStatus(id, status)
      .then(load)
      .catch((e) => setError(parseApiError(e)));
  };

  const doctor = data?.doctor;

  return (
    <DoctorPortalLayout pageTitle="Paneli i mjekut">
      <PageHeader
        title="Paneli i mjekut"
        subtitle={
          doctor
            ? `${doctor.fullName} · ${doctor.specialty || ""} · ${doctor.departmentName || doctor.department?.name || ""}`
            : "Mirë se vini"
        }
        icon={LayoutDashboard}
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
      ) : data ? (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Terminet"
              value={data.appointmentCount ?? 0}
              icon={CalendarDays}
              color="bg-blue-50 text-blue-600"
            />
            <StatCard
              title="Në pritje"
              value={data.pendingAppointments ?? 0}
              icon={Clock}
              color="bg-amber-50 text-amber-600"
            />
            <StatCard
              title="Diagnoza"
              value={data.diagnosisCount ?? 0}
              icon={Activity}
              color="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              title="Receta"
              value={data.prescriptionCount ?? 0}
              icon={Pill}
              color="bg-violet-50 text-violet-600"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <MedicalCard title="Terminet e fundit" icon={CalendarDays}>
              <div className="space-y-2">
                {(data.appointments || []).slice(0, 5).map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-colors hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{a.patientName}</p>
                        <p className="text-xs text-slate-500">{a.preferredDate || "—"}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    {a.status === "PENDING" ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <PrimaryButton
                          variant="success"
                          className="!px-3 !py-1.5 text-xs"
                          onClick={() => changeStatus(a.id, "CONFIRMED")}
                        >
                          <Check size={14} />
                          Prano
                        </PrimaryButton>
                        <PrimaryButton
                          variant="danger"
                          className="!px-3 !py-1.5 text-xs"
                          onClick={() => changeStatus(a.id, "REJECTED")}
                        >
                          <Ban size={14} />
                          Refuzo
                        </PrimaryButton>
                      </div>
                    ) : null}
                  </div>
                ))}
                {!data.appointments?.length ? (
                  <p className="py-6 text-center text-sm text-slate-500">Nuk ka termine.</p>
                ) : null}
              </div>
              <Link
                to="/doctor/appointments"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Shiko të gjitha
                <ArrowRight size={14} />
              </Link>
            </MedicalCard>

            <MedicalCard title="Shkurtesa" icon={LayoutDashboard}>
              <div className="grid gap-3 sm:grid-cols-2">
                {SHORTCUTS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.to}
                      to={s.to}
                      className="group flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.color}`}
                      >
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 group-hover:text-blue-700">
                          {s.label}
                        </p>
                        <p className="text-xs text-slate-500">{s.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </MedicalCard>
          </div>
        </>
      ) : null}
    </DoctorPortalLayout>
  );
}
