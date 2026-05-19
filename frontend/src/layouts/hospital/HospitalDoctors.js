import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
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
import { hospitalApi } from "api/hospitalApi";

const empty = {
  fullName: "",
  email: "",
  phone: "",
  specialty: "",
  bio: "",
  imageUrl: "",
  departmentId: "",
};

export default function HospitalDoctors() {
  const [rows, setRows] = useState([]);
  const [depts, setDepts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const load = () =>
    hospitalApi.doctors
      .list()
      .then(setRows)
      .catch((e) => setError(String(e.message)));

  useEffect(() => {
    hospitalApi.departments
      .list()
      .then(setDepts)
      .catch(() => {});
    load();
  }, []);

  useEffect(() => {
    if (depts.length && !form.departmentId) {
      setForm((f) => ({ ...f, departmentId: String(depts[0].id) }));
    }
  }, [depts]);

  const startCreate = () => {
    setEditId(null);
    setForm({
      ...empty,
      departmentId: depts[0] ? String(depts[0].id) : "",
    });
    setOpen(true);
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setForm({
      fullName: row.fullName || "",
      email: row.email || "",
      phone: row.phone || "",
      specialty: row.specialty || "",
      bio: row.bio || "",
      imageUrl: row.imageUrl || "",
      departmentId: String(row.department?.id || depts[0]?.id || ""),
    });
    setOpen(true);
  };

  const save = () => {
    const body = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      specialty: form.specialty,
      bio: form.bio,
      imageUrl: form.imageUrl || null,
      departmentId: Number(form.departmentId),
    };
    const p = editId ? hospitalApi.doctors.update(editId, body) : hospitalApi.doctors.create(body);
    p.then(() => {
      setOpen(false);
      load();
    }).catch((e) => setError(String(e.message)));
  };

  const remove = (id) => {
    if (!window.confirm("Të fshihet ky mjek?")) return;
    hospitalApi.doctors
      .remove(id)
      .then(load)
      .catch((e) => setError(String(e.message)));
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
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Mjekët
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
                        <TableCell>Specialiteti</TableCell>
                        <TableCell>Departamenti</TableCell>
                        <TableCell align="right">Veprimet</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.fullName}</TableCell>
                          <TableCell>{r.specialty}</TableCell>
                          <TableCell>{r.department?.name}</TableCell>
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
        <DialogTitle>{editId ? "Ndrysho mjekun" : "Mjek i ri"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Emri i plotë"
            fullWidth
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Departamenti"
            fullWidth
            value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
          >
            {depts.map((d) => (
              <MenuItem key={d.id} value={String(d.id)}>
                {d.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Specialiteti"
            fullWidth
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefoni"
            fullWidth
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Biografia"
            fullWidth
            multiline
            minRows={2}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL e fotos"
            fullWidth
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
