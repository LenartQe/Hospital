import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Activity,
  Pill,
  UserCircle,
  LogOut,
  Menu,
  X,
  Stethoscope,
} from "lucide-react";
import { clearAuth, getAuth } from "auth/authStorage";
import PatientAvatar from "./components/PatientAvatar";
import "./doctor-portal.css";

const DOCTOR_MENU = [
  { id: "dashboard", label: "Paneli", route: "/doctor/dashboard", icon: LayoutDashboard },
  { id: "appointments", label: "Terminet", route: "/doctor/appointments", icon: CalendarDays },
  { id: "patients", label: "Pacientët", route: "/doctor/patients", icon: Users },
  { id: "diagnoses", label: "Diagnozat", route: "/doctor/diagnoses", icon: Activity },
  { id: "prescriptions", label: "Recetat", route: "/doctor/prescriptions", icon: Pill },
  { id: "profile", label: "Profili", route: "/doctor/profile", icon: UserCircle },
];

export default function DoctorPortalLayout({ children, pageTitle }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const auth = getAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate("/authentication/sign-in?role=doctor");
  };

  const navContent = (
    <>
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/25 text-blue-200 shadow-inner">
            <Stethoscope className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Portali i mjekut
            </p>
            <p className="text-[0.95rem] font-bold leading-tight text-white">Spitali i Prizrenit</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
        {DOCTOR_MENU.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.route;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                navigate(item.route);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/90 text-white shadow-md shadow-blue-900/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3">
          <PatientAvatar name={auth?.fullName || "Mjek"} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{auth?.fullName || "Mjek"}</p>
            <p className="truncate text-xs text-slate-400">{auth?.email || ""}</p>
          </div>
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-200"
        >
          <LogOut size={16} />
          Dil
        </button>
      </div>
    </>
  );

  return (
    <div id="doctor-portal" className="doctor-portal font-sans antialiased">
      <aside className="doctor-portal__sidebar">{navContent}</aside>

      {mobileOpen ? (
        <div className="doctor-portal__overlay lg:hidden">
          <button
            type="button"
            className="doctor-portal__backdrop"
            onClick={() => setMobileOpen(false)}
            aria-label="Mbyll menunë"
          />
          <aside className="doctor-portal__drawer">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 z-10 rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Mbyll"
            >
              <X size={20} />
            </button>
            {navContent}
          </aside>
        </div>
      ) : null}

      <div className="doctor-portal__main">
        <header className="doctor-portal__header sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/90 bg-white/95 px-4 py-3.5 shadow-sm backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
              aria-label="Hap menunë"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Mjek — Spitali
              </p>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{pageTitle}</h2>
            </div>
          </div>
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2 sm:flex">
            <span className="text-sm font-semibold text-slate-700">{auth?.fullName}</span>
            <span
              className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"
              title="Online"
            />
          </div>
        </header>

        <main className="doctor-portal__content bg-slate-50 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

DoctorPortalLayout.propTypes = {
  children: PropTypes.node.isRequired,
  pageTitle: PropTypes.string.isRequired,
};
