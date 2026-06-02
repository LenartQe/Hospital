import PropTypes from "prop-types";

export default function PatientEmptyState({ icon, message }) {
  return (
    <div className="patient-empty">
      <span className="patient-empty__icon material-icons-round" aria-hidden>
        {icon}
      </span>
      <p className="patient-empty__text">{message}</p>
    </div>
  );
}

PatientEmptyState.propTypes = {
  icon: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
