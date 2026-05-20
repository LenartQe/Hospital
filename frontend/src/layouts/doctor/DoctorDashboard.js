import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { hospitalApi } from "api/hospitalApi";
import { Link } from "react-router-dom";

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
  const appointments = data?.appointments || [];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h4" fontWeight="bold" mb={2}>
          Paneli i mjekut
        </MDTypography>
        {error ? <MDTypography color="error">{error}</MDTypography> : null}
        {doctor ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <MDTypography variant="h6">{doctor.fullName}</MDTypography>
                <MDTypography variant="body2" color="text">
                  {doctor.specialty}
                </MDTypography>
                <MDTypography variant="body2" mt={1}>
                  {doctor.department?.name}
                </MDTypography>
                <MDBox mt={2}>
                  <MDTypography
                    component={Link}
                    to="/doctor/patients"
                    variant="button"
                    color="info"
                  >
                    Menaxho pacientët →
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 2 }}>
                <MDTypography variant="h6" mb={1}>
                  Terminet ({appointments.length})
                </MDTypography>
                {appointments.length ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Pacienti</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Statusi</TableCell>
                        <TableCell>Kontakt</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>{a.patientName}</TableCell>
                          <TableCell>{a.preferredDate || "—"}</TableCell>
                          <TableCell>{a.status}</TableCell>
                          <TableCell>{a.email || a.phone || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <MDTypography variant="body2" color="text">
                    Nuk ka termine për momentin.
                  </MDTypography>
                )}
              </Card>
            </Grid>
          </Grid>
        ) : null}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
