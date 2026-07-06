import PropTypes from "prop-types";

export default function MedicalCard({ children, className = "", title, icon: Icon }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover ${className}`}
    >
      {title ? (
        <div className="mb-5 flex items-center gap-2.5">
          {Icon ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
          ) : null}
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        </div>
      ) : null}
      {children}
    </div>
  );
}

MedicalCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.elementType,
};
