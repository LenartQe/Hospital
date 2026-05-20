import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import "hospital-public/hospital-auth.css";

export default function HospitalAuthLayout({ children, title, subtitle }) {
  return (
    <div className="hospital-auth-page">
      <header className="hospital-auth-header">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <Link to="/" className="hospital-auth-brand text-dark font-weight-bold">
            Spitali i Prizrenit
          </Link>
          <Link to="/" className="btn btn-outline-main btn-sm">
            Faqja kryesore
          </Link>
        </div>
      </header>
      <main className="hospital-auth-main">
        <div className="container">
          <MDBox textAlign="center" mb={3} className="hospital-auth-intro">
            <MDTypography variant="h3" fontWeight="bold" color="dark">
              {title}
            </MDTypography>
            {subtitle ? (
              <MDTypography variant="body2" color="text" mt={1}>
                {subtitle}
              </MDTypography>
            ) : null}
          </MDBox>
          <MDBox className="hospital-auth-card-wrap">{children}</MDBox>
        </div>
      </main>
    </div>
  );
}

HospitalAuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

HospitalAuthLayout.defaultProps = {
  subtitle: null,
};
