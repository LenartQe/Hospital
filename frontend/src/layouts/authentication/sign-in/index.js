import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import HospitalAuthLayout from "layouts/authentication/components/HospitalAuthLayout";
import { hospitalApi } from "api/hospitalApi";
import { setAuth, homeRouteForRole } from "auth/authStorage";

const ROLES = [
  { key: "PATIENT", label: "Pacient" },
  { key: "DOCTOR", label: "Mjek" },
  { key: "ADMIN", label: "Administrim" },
];

function roleFromQuery(param) {
  if (param === "doctor") return "DOCTOR";
  if (param === "admin") return "ADMIN";
  return "PATIENT";
}

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(roleFromQuery(searchParams.get("role")));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleIndex = ROLES.findIndex((r) => r.key === role);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await hospitalApi.auth.login({ email, password, role });
      setAuth(data);
      navigate(homeRouteForRole(data.role));
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message);
        setError(parsed.message || "Hyrja dështoi.");
      } catch {
        setError(err.message || "Hyrja dështoi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <HospitalAuthLayout
      title="Hyrja në sistem"
      subtitle="Zgjidhni llojin e llogarisë dhe identifikohuni."
    >
      <Card sx={{ p: 3, boxShadow: "0 8px 32px rgba(34,58,102,0.12)" }}>
        <Tabs
          value={roleIndex >= 0 ? roleIndex : 0}
          onChange={(_, idx) => setRole(ROLES[idx].key)}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          {ROLES.map((r) => (
            <Tab key={r.key} label={r.label} />
          ))}
        </Tabs>

        <MDBox component="form" onSubmit={handleSignIn}>
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
            {loading ? "Duke u identifikuar…" : "Hyr"}
          </MDButton>
        </MDBox>

        {role === "PATIENT" ? (
          <MDBox mt={2} textAlign="center">
            <MDTypography variant="button" color="text">
              Nuk keni llogari?{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-up"
                variant="button"
                color="info"
                fontWeight="medium"
              >
                Regjistrohu si pacient
              </MDTypography>
            </MDTypography>
          </MDBox>
        ) : null}

        <MDBox className="hospital-auth-demo">
          <strong>Demo:</strong> fjalëkalimi <code>hospital123</code>
          <br />
          Pacient: patient@hospital.local — Mjek: s.mitchell@hospital.local — Admin: admin@hospital.local
        </MDBox>
      </Card>
    </HospitalAuthLayout>
  );
}
