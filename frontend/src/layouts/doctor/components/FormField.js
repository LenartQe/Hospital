import PropTypes from "prop-types";

export default function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  as = "input",
  options = [],
  rows = 3,
  required = false,
}) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const commonProps = {
    id: fieldId,
    value,
    onChange,
    placeholder,
    required,
    className: as === "select" ? "doctor-portal-select" : "doctor-portal-input",
  };

  return (
    <div className="mb-4">
      {label ? (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      {as === "textarea" ? (
        <textarea {...commonProps} rows={rows} />
      ) : as === "select" ? (
        <select {...commonProps}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  as: PropTypes.oneOf(["input", "textarea", "select"]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  rows: PropTypes.number,
  required: PropTypes.bool,
};
