import PropTypes from "prop-types";

const STATUS_CONFIG = {
  PENDING: { label: "Në pritje", className: "bg-amber-100 text-amber-800 ring-amber-200" },
  CONFIRMED: { label: "Aprovuar", className: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  CANCELLED: { label: "Anuluar", className: "bg-red-100 text-red-800 ring-red-200" },
  COMPLETED: { label: "Përfunduar", className: "bg-slate-100 text-slate-700 ring-slate-200" },
  ACTIVE: { label: "Aktive", className: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  INACTIVE: { label: "Joaktive", className: "bg-slate-100 text-slate-600 ring-slate-200" },
};

export default function StatusBadge({ status }) {
  const key = String(status || "").toUpperCase();
  const config = STATUS_CONFIG[key] || {
    label: status || "—",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string,
};
