import PropTypes from "prop-types";

export default function PageHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      {Icon ? (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
      ) : null}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
};
