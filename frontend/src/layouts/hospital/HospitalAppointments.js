import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { hospitalApi, parseApiError } from "api/hospitalApi";

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
const STATUS_LABEL = {
  PENDING: "Në pritje",
  CONFIRMED: "Konfirmuar",
  CANCELLED: "Anuluar",
  COMPLETED: "Përfunduar",
};

export default function HospitalAppointments() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    hospitalApi.appointments
      .list()
      .then(setRows)
      .catch((e) => setError(parseApiError(e)));

  useEffect(() => {
    load();
  }, []);

  const changeStatus = (id, status) => {
    hospitalApi.appointments
      .updateStatus(id, status)
      .then(load)
      .catch((e) => setError(parseApiError(e)));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="primary"
              >
                <MDTypography variant="h6" color="white">
                  Terminet
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2} pb={2}>
                {error && (
                  <MDTypography variant="caption" color="error" display="block" mb={2}>
                    {error}
                  </MDTypography>
                )}
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Pacienti</TableCell>
                        <TableCell>Mjeku</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Statusi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.patientName}</TableCell>
                          <TableCell>{r.doctor?.fullName}</TableCell>
                          <TableCell>{r.preferredDate || "—"}</TableCell>
                          <TableCell>
                            <TextField
                              select
                              size="small"
                              value={r.status}
                              onChange={(e) => changeStatus(r.id, e.target.value)}
                            >
                              {STATUSES.map((s) => (
                                <MenuItem key={s} value={s}>
                                  {STATUS_LABEL[s] || s}
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
