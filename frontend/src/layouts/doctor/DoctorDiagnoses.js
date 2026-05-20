import { useEffect, useState } from "react";
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

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("sq-AL");
}

export default function DoctorDiagnoses() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    hospitalApi.doctor
      .diagnoses()
      .then(setRows)
      .catch((e) => setError(String(e.message)));
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h4" fontWeight="bold" mb={2}>
          Diagnozat e mia
        </MDTypography>
        {error ? <MDTypography color="error">{error}</MDTypography> : null}
        <Card sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Titulli</TableCell>
                <TableCell>Përshkrimi</TableCell>
                <TableCell>Pacienti</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.title}</TableCell>
                  <TableCell>{d.description || "—"}</TableCell>
                  <TableCell>{d.patientName}</TableCell>
                  <TableCell>{formatDate(d.diagnosedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!rows.length ? (
            <MDTypography variant="body2" color="text" mt={2}>
              Nuk keni diagnoza të regjistruara.
            </MDTypography>
          ) : null}
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
