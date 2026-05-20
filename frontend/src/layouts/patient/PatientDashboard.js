import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { hospitalApi } from "api/hospitalApi";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("sq-AL");
}

export default function PatientDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    hospitalApi.patient
      .dashboard()
      .then(setData)
      .catch((e) => setError(String(e.message)));
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h4" fontWeight="bold" mb={2}>
          Paneli i pacientit
        </MDTypography>
        {error ? <MDTypography color="error">{error}</MDTypography> : null}
        {data ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <MDTypography variant="h6">Profili im</MDTypography>
                <MDTypography variant="body2" mt={1}>
                  <strong>Emri:</strong> {data.fullName}
                </MDTypography>
                <MDTypography variant="body2">
                  <strong>Email:</strong> {data.email}
                </MDTypography>
                <MDTypography variant="body2">
                  <strong>Telefoni:</strong> {data.phone || "—"}
                </MDTypography>
                <MDTypography variant="body2">
                  <strong>Gjak:</strong> {data.bloodType || "—"}
                </MDTypography>
                <MDTypography variant="body2">
                  <strong>Alergjitë:</strong> {data.allergies || "—"}
                </MDTypography>
                {data.notes ? (
                  <MDTypography variant="caption" color="text" display="block" mt={1}>
                    {data.notes}
                  </MDTypography>
                ) : null}
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 2, mb: 2 }}>
                <MDTypography variant="h6" mb={1}>
                  Diagnozat
                </MDTypography>
                {data.diagnoses?.length ? (
                  data.diagnoses.map((d) => (
                    <MDBox key={d.id} mb={1.5} p={1.5} borderRadius="md" bgcolor="grey.100">
                      <MDTypography variant="button" fontWeight="bold">
                        {d.title}
                      </MDTypography>
                      <MDTypography variant="caption" display="block" color="text">
                        Dr. {d.doctor?.fullName} · {formatDate(d.diagnosedAt)}
                        {d.severity ? ` · ${d.severity}` : ""}
                      </MDTypography>
                      <MDTypography variant="body2">{d.description}</MDTypography>
                    </MDBox>
                  ))
                ) : (
                  <MDTypography variant="body2" color="text">
                    Nuk ka diagnoza të regjistruara.
                  </MDTypography>
                )}
              </Card>
              <Card sx={{ p: 2 }}>
                <MDTypography variant="h6" mb={1}>
                  Barnat e përshkruara
                </MDTypography>
                {data.prescriptions?.length ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Barna</TableCell>
                        <TableCell>Doza</TableCell>
                        <TableCell>Frekuenca</TableCell>
                        <TableCell>Mjeku</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.prescriptions.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.medicine?.name}</TableCell>
                          <TableCell>{p.dosage}</TableCell>
                          <TableCell>{p.frequency}</TableCell>
                          <TableCell>{p.doctor?.fullName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <MDTypography variant="body2" color="text">
                    Nuk ka receta aktive.
                  </MDTypography>
                )}
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <MDTypography variant="h6" mb={1}>
                  Terminet e mia
                </MDTypography>
                {data.appointments?.length ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Data</TableCell>
                        <TableCell>Mjeku</TableCell>
                        <TableCell>Statusi</TableCell>
                        <TableCell>Mesazhi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.appointments.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>{a.preferredDate || formatDate(a.createdAt)}</TableCell>
                          <TableCell>{a.doctor?.fullName || "—"}</TableCell>
                          <TableCell>
                            <Chip label={a.status} size="small" color="info" />
                          </TableCell>
                          <TableCell>{a.message || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <MDTypography variant="body2" color="text">
                    Nuk keni termine të lidhura me llogarinë. Rezervoni nga faqja publike.
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
