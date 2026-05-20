import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { getAuth } from "auth/authStorage";

export default function ProtectedRoute({ children, roles }) {
  const auth = getAuth();
  if (!auth?.token) {
    return <Navigate to="/authentication/sign-in" replace />;
  }
  if (roles && !roles.includes(auth.role)) {
    return (
      <Navigate
        to={
          auth.role === "PATIENT"
            ? "/patient/dashboard"
            : auth.role === "DOCTOR"
            ? "/doctor/dashboard"
            : "/dashboard"
        }
        replace
      />
    );
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};
