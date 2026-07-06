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
      <div className="border-b border-white/10 px-4 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
            <Stethoscope className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-widest text-slate-400">
              Portali i mjekut
            </p>
            <p className="text-sm font-bold text-white">Spitali i Prizrenit</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
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
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/20 text-blue-200 shadow-sm"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-300" : ""}`} size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-xl bg-white/5 px-3 py-2.5">
          <p className="truncate text-xs font-semibold text-white">{auth?.fullName || "Mjek"}</p>
          <p className="truncate text-[0.7rem] text-slate-400">{auth?.email || ""}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={16} />
          Dil
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-gradient-to-b from-slate-800 to-slate-900 lg:flex">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Mbyll menunë"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Mbyll"
            >
              <X size={20} />
            </button>
            {navContent}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Hap menunë"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Mjek — Spitali
              </p>
              <h2 className="text-lg font-bold text-slate-900">{pageTitle}</h2>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-sm font-medium text-slate-600">{auth?.fullName}</span>
            <span
              className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"
              title="Online"
            />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

DoctorPortalLayout.propTypes = {
  children: PropTypes.node.isRequired,
  pageTitle: PropTypes.string.isRequired,
};
