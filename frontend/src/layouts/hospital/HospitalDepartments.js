import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { hospitalApi, parseApiError } from "api/hospitalApi";

const empty = { name: "", description: "", location: "", headDoctorName: "" };

export default function HospitalDepartments() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const load = () =>
    hospitalApi.departments
      .list()
      .then(setRows)
      .catch((e) => setError(parseApiError(e)));

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setForm({
      name: row.name || "",
      description: row.description || "",
      location: row.location || "",
      headDoctorName: row.headDoctorName || "",
    });
    setOpen(true);
  };

  const save = () => {
    const body = {
      name: form.name,
      description: form.description,
      location: form.location,
      headDoctorName: form.headDoctorName,
    };
    const p = editId
      ? hospitalApi.departments.update(editId, body)
      : hospitalApi.departments.create(body);
    p.then(() => {
      setOpen(false);
      load();
    }).catch((e) => setError(parseApiError(e)));
  };

  const remove = (id) => {
    if (!window.confirm("Të fshihet ky departament? Mjekët e lidhur do të shkëputen nga ky departament.")) return;
    hospitalApi.departments
      .remove(id)
      .then(() => {
        setError("");
        load();
      })
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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Departamentet
                </MDTypography>
                <Button color="inherit" variant="contained" onClick={startCreate}>
                  Shto
                </Button>
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
                        <TableCell>Emri</TableCell>
                        <TableCell>Vendndodhja</TableCell>
                        <TableCell>Kreu</TableCell>
                        <TableCell align="right">Veprimet</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.name}</TableCell>
                          <TableCell>{r.location}</TableCell>
                          <TableCell>{r.headDoctorName}</TableCell>
                          <TableCell align="right">
                            <IconButton size="small" color="info" onClick={() => startEdit(r)}>
                              <Icon fontSize="small">edit</Icon>
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => remove(r.id)}>
                              <Icon fontSize="small">delete</Icon>
                            </IconButton>
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
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Ndrysho departamentin" : "Departament i ri"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Emri"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Përshkrimi"
            fullWidth
            multiline
            minRows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Vendndodhja"
            fullWidth
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Emri i kryemjekut"
            fullWidth
            value={form.headDoctorName}
            onChange={(e) => setForm({ ...form, headDoctorName: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Anulo</Button>
          <Button onClick={save} variant="contained">
            Ruaj
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
