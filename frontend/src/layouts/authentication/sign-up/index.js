import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import HospitalAuthLayout from "layouts/authentication/components/HospitalAuthLayout";
import { hospitalApi } from "api/hospitalApi";
import { setAuth, homeRouteForRole } from "auth/authStorage";

export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await hospitalApi.auth.registerPatient({ email, password, fullName, phone });
      setAuth(data);
      navigate(homeRouteForRole(data.role));
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message);
        setError(parsed.message || "Regjistrimi dështoi.");
      } catch {
        setError(err.message || "Regjistrimi dështoi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <HospitalAuthLayout
      title="Regjistrimi i pacientit"
      subtitle="Krijoni llogarinë tuaj për të parë diagnozat, barnat dhe terminet."
    >
      <Card sx={{ p: 3, boxShadow: "0 8px 32px rgba(34,58,102,0.12)" }}>
        <MDBox component="form" onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDInput
              label="Emri i plotë"
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="email"
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              label="Telefoni"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="password"
              label="Fjalëkalimi"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </MDBox>
          {error ? (
            <MDTypography variant="caption" color="error" display="block" mb={1}>
              {error}
            </MDTypography>
          ) : null}
          <MDButton type="submit" variant="gradient" color="info" fullWidth disabled={loading}>
            {loading ? "Duke u regjistruar…" : "Regjistrohu"}
          </MDButton>
          <MDBox mt={2} textAlign="center">
            <MDTypography
              component={Link}
              to="/authentication/sign-in?role=patient"
              variant="button"
              color="text"
            >
              Kthehu te hyrja
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    </HospitalAuthLayout>
  );
}
