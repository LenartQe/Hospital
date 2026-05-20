import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { hospitalApi } from "api/hospitalApi";

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [dxTitle, setDxTitle] = useState("");
  const [dxDesc, setDxDesc] = useState("");
  const [medId, setMedId] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    hospitalApi.doctor
      .patients()
      .then(setPatients)
      .catch((e) => setError(String(e.message)));
    hospitalApi.medicines
      .list()
      .then(setMedicines)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const submitDiagnosis = () => {
    if (!patientId || !dxTitle) return;
    hospitalApi.doctor
      .addDiagnosis(patientId, { title: dxTitle, description: dxDesc, severity: "MODERATE" })
      .then(() => {
        setMsg("Diagnoza u ruajt.");
        setDxTitle("");
        setDxDesc("");
      })
      .catch((e) => setError(String(e.message)));
  };

  const submitPrescription = () => {
    if (!patientId || !medId || !dosage) return;
    hospitalApi.doctor
      .addPrescription(patientId, {
        medicineId: Number(medId),
        dosage,
        frequency,
        instructions: "",
      })
      .then(() => {
        setMsg("Receta u ruajt.");
        setDosage("");
        setFrequency("");
      })
      .catch((e) => setError(String(e.message)));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h4" fontWeight="bold" mb={2}>
          Pacientët
        </MDTypography>
        {error ? <MDTypography color="error">{error}</MDTypography> : null}
        {msg ? <MDTypography color="success">{msg}</MDTypography> : null}

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 2 }}>
              <MDTypography variant="h6" mb={2}>
                Lista e pacientëve
              </MDTypography>
              {patients.map((p) => (
                <MDBox
                  key={p.id}
                  mb={1}
                  p={1}
                  borderRadius="md"
                  bgcolor={String(patientId) === String(p.id) ? "info.main" : "grey.100"}
                  sx={{
                    cursor: "pointer",
                    color: String(patientId) === String(p.id) ? "#fff" : "inherit",
                  }}
                  onClick={() => setPatientId(String(p.id))}
                >
                  <MDTypography variant="button" fontWeight="bold">
                    {p.fullName}
                  </MDTypography>
                  <MDTypography variant="caption" display="block">
                    {p.email}
                  </MDTypography>
                </MDBox>
              ))}
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 2, mb: 2 }}>
              <MDTypography variant="h6" mb={2}>
                Shto diagnozë
              </MDTypography>
              <TextField
                select
                fullWidth
                label="Pacienti"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
              >
                {patients.map((p) => (
                  <MenuItem key={p.id} value={String(p.id)}>
                    {p.fullName}
                  </MenuItem>
                ))}
              </TextField>
              <MDBox mb={2}>
                <MDInput
                  label="Titulli i diagnozës"
                  fullWidth
                  value={dxTitle}
                  onChange={(e) => setDxTitle(e.target.value)}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  label="Përshkrimi"
                  fullWidth
                  multiline
                  rows={3}
                  value={dxDesc}
                  onChange={(e) => setDxDesc(e.target.value)}
                />
              </MDBox>
              <MDButton variant="gradient" color="info" onClick={submitDiagnosis}>
                Ruaj diagnozën
              </MDButton>
            </Card>
            <Card sx={{ p: 2 }}>
              <MDTypography variant="h6" mb={2}>
                Përshkruaj barnë
              </MDTypography>
              <TextField
                select
                fullWidth
                label="Barna"
                value={medId}
                onChange={(e) => setMedId(e.target.value)}
                sx={{ mb: 2 }}
                size="small"
              >
                {medicines.map((m) => (
                  <MenuItem key={m.id} value={String(m.id)}>
                    {m.name}
                  </MenuItem>
                ))}
              </TextField>
              <MDBox mb={2}>
                <MDInput
                  label="Doza"
                  fullWidth
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  label="Frekuenca"
                  fullWidth
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                />
              </MDBox>
              <MDButton variant="gradient" color="success" onClick={submitPrescription}>
                Ruaj recetën
              </MDButton>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
