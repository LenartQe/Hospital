import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { hospitalApi } from "api/hospitalApi";
import { Link } from "react-router-dom";

function StatCard({ title, value, color }) {
  return (
    <Card sx={{ p: 2 }}>
      <MDTypography variant="button" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="h4" color={color || "dark"} fontWeight="bold">
        {value}
      </MDTypography>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
};

export default function DoctorDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    hospitalApi.doctor
      .dashboard()
      .then(setData)
      .catch((e) => setError(String(e.message)));
  }, []);

  const doctor = data?.doctor;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h4" fontWeight="bold" mb={1}>
          Paneli i mjekut
        </MDTypography>
        {doctor ? (
          <MDTypography variant="body2" color="text" mb={3}>
            {doctor.fullName} · {doctor.specialty} · {doctor.department?.name}
          </MDTypography>
        ) : null}
        {error ? <MDTypography color="error">{error}</MDTypography> : null}
        {data ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Terminet" value={data.appointmentCount ?? 0} color="info" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Në pritje" value={data.pendingAppointments ?? 0} color="warning" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Diagnoza" value={data.diagnosisCount ?? 0} color="success" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Receta" value={data.prescriptionCount ?? 0} color="success" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <MDBox display="flex" justifyContent="space-between" mb={1}>
                  <MDTypography variant="h6">Terminet e fundit</MDTypography>
                  <MDTypography
                    component={Link}
                    to="/doctor/appointments"
                    variant="button"
                    color="info"
                  >
                    Shiko të gjitha →
                  </MDTypography>
                </MDBox>
                {(data.appointments || []).slice(0, 5).map((a) => (
                  <MDBox key={a.id} mb={1} p={1} bgcolor="grey.100" borderRadius="md">
                    <MDTypography variant="button" fontWeight="bold">
                      {a.patientName}
                    </MDTypography>
                    <MDTypography variant="caption" display="block">
                      {a.preferredDate || "—"} · {a.status}
                    </MDTypography>
                  </MDBox>
                ))}
                {!data.appointments?.length ? (
                  <MDTypography variant="body2" color="text">
                    Nuk ka termine.
                  </MDTypography>
                ) : null}
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <MDTypography variant="h6" mb={1}>
                  Shkurtesa
                </MDTypography>
                <MDTypography variant="body2" mb={1}>
                  <Link to="/doctor/appointments">Terminet</Link> — konfirmo ose anulo
                </MDTypography>
                <MDTypography variant="body2" mb={1}>
                  <Link to="/doctor/patients">Pacientët</Link> — diagnoza dhe receta
                </MDTypography>
                <MDTypography variant="body2" mb={1}>
                  <Link to="/doctor/diagnoses">Diagnozat e mia</Link>
                </MDTypography>
                <MDTypography variant="body2">
                  <Link to="/doctor/prescriptions">Recetat e mia</Link>
                </MDTypography>
              </Card>
            </Grid>
          </Grid>
        ) : null}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
