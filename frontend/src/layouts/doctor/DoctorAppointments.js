import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
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

const STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
const STATUS_LABEL = {
  PENDING: "Në pritje",
  CONFIRMED: "Konfirmuar",
  CANCELLED: "Anuluar",
  COMPLETED: "Përfunduar",
};

export default function DoctorAppointments() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    hospitalApi.doctor
      .appointments()
      .then(setRows)
      .catch((e) => setError(String(e.message)));

  useEffect(() => {
    load();
  }, []);

  const changeStatus = (id, status) => {
    hospitalApi.doctor
      .updateAppointmentStatus(id, status)
      .then(load)
      .catch((e) => setError(String(e.message)));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h4" fontWeight="bold" mb={2}>
          Terminet e mia
        </MDTypography>
        {error ? <MDTypography color="error">{error}</MDTypography> : null}
        <Card sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Pacienti</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefoni</TableCell>
                <TableCell>Data e preferuar</TableCell>
                <TableCell>Mesazhi</TableCell>
                <TableCell>Statusi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.patientName}</TableCell>
                  <TableCell>{r.email || "—"}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{r.phone || "—"}</TableCell>
                  <TableCell>{r.preferredDate || "—"}</TableCell>
                  <TableCell>{r.message || "—"}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={r.status}
                      onChange={(e) => changeStatus(r.id, e.target.value)}
                      sx={{ minWidth: 140 }}
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
          {!rows.length ? (
            <MDTypography variant="body2" color="text" mt={2}>
              Nuk ka termine të regjistruara për ju.
            </MDTypography>
          ) : null}
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
