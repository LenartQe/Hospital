import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { hospitalApi } from "api/hospitalApi";

export default function DoctorProfile() {
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    hospitalApi.doctor
      .profile()
      .then(setDoc)
      .catch((e) => setError(String(e.message)));
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h4" fontWeight="bold" mb={2}>
          Profili im
        </MDTypography>
        {error ? <MDTypography color="error">{error}</MDTypography> : null}
        {doc ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <MDTypography variant="h5" mb={2}>
                  {doc.fullName}
                </MDTypography>
                <MDTypography variant="body2" mb={1}>
                  <strong>Specialiteti:</strong> {doc.specialty || "—"}
                </MDTypography>
                <MDTypography variant="body2" mb={1}>
                  <strong>Departamenti:</strong> {doc.department?.name || "—"}
                </MDTypography>
                <MDTypography variant="body2" mb={1}>
                  <strong>Email:</strong> {doc.email || "—"}
                </MDTypography>
                <MDTypography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                  <strong>Telefoni:</strong> {doc.phone || "—"}
                </MDTypography>
                {doc.bio ? (
                  <MDTypography variant="body2" mt={2} color="text">
                    {doc.bio}
                  </MDTypography>
                ) : null}
              </Card>
            </Grid>
          </Grid>
        ) : null}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
