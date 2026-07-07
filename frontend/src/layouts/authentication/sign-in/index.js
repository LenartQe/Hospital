import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import HospitalAuthLayout from "layouts/authentication/components/HospitalAuthLayout";
import { hospitalApi, parseApiError } from "api/hospitalApi";
import { setAuth, homeRouteForRole } from "auth/authStorage";
import { DOCTOR_PFP_FALLBACK, doctorPhoto } from "hospital-public/hospitalImages";

const ROLES = [
  { key: "PATIENT", label: "Pacient" },
  { key: "DOCTOR", label: "Mjek" },
  { key: "ADMIN", label: "Administrim web" },
];

function DoctorLoginAvatar({ doctor }) {
  const [img, setImg] = useState(() => doctorPhoto(doctor));

  useEffect(() => {
    setImg(doctorPhoto(doctor));
  }, [doctor]);

  return (
    <MDBox
      component="img"
      src={img}
      alt={doctor.fullName}
      onError={() => setImg(DOCTOR_PFP_FALLBACK)}
      sx={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #fff",
        boxShadow: "0 4px 12px rgba(15,23,42,0.12)",
        flexShrink: 0,
      }}
    />
  );
}

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
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleIndex = ROLES.findIndex((r) => r.key === role);
  const selectedDoctor = doctorOptions.find((d) => d.id === selectedDoctorId) || null;

  const selectDoctor = (doctor) => {
    setSelectedDoctorId(doctor.id);
    setEmail(doctor.email);
    setPassword(doctor.password || "");
    setError("");
  };

  useEffect(() => {
    setRole(roleFromQuery(searchParams.get("role")));
  }, [searchParams]);

  useEffect(() => {
    if (role !== "DOCTOR") {
      return;
    }
    hospitalApi.auth
      .doctorEmails()
      .then((list) => {
        setDoctorOptions(list);
        const fromQuery = searchParams.get("doctorId");
        if (fromQuery) {
          const match = list.find((d) => String(d.id) === String(fromQuery));
          if (match) {
            selectDoctor(match);
            return;
          }
        }
        if (list.length) {
          selectDoctor(list[0]);
        }
      })
      .catch(() => setDoctorOptions([]));
  }, [role, searchParams]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const loginEmail =
      role === "DOCTOR" ? email.trim() : email.trim() || "guest@hospital.local";
    if (role === "DOCTOR" && !loginEmail) {
      setError("Zgjidhni mjekun nga lista.");
      setLoading(false);
      return;
    }
    try {
      const data = await hospitalApi.auth.login({
        email: loginEmail,
        password: role === "PATIENT" && !password ? "guest" : password,
        role,
        doctorId: role === "DOCTOR" ? selectedDoctorId : undefined,
      });
      setAuth(data);
      navigate(homeRouteForRole(data.role));
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <HospitalAuthLayout
      title="Hyrja në sistem"
      subtitle="Zgjidhni rolin tuaj dhe identifikohuni në portal."
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
          {role === "DOCTOR" ? (
            <MDBox mb={3}>
              <MDTypography variant="button" fontWeight="medium" display="block" mb={1.5}>
                Zgjidhni mjekun (si në faqen Mjekët)
              </MDTypography>
              <MDBox
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  maxHeight: 320,
                  overflowY: "auto",
                  pr: 0.5,
                }}
              >
                {doctorOptions.length ? (
                  doctorOptions.map((doctor) => {
                    const active = selectedDoctorId === doctor.id;
                    return (
                      <MDBox
                        key={doctor.id}
                        onClick={() => selectDoctor(doctor)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderRadius: "14px",
                          border: "2px solid",
                          borderColor: active ? "#1A73E8" : "#E2E8F0",
                          backgroundColor: active ? "rgba(26,115,232,0.06)" : "#F8FAFC",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "#1A73E8",
                            backgroundColor: "rgba(26,115,232,0.04)",
                          },
                        }}
                      >
                        <DoctorLoginAvatar doctor={doctor} />
                        <MDBox sx={{ flex: 1, minWidth: 0 }}>
                          <MDTypography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.3 }}>
                            {doctor.fullName}
                          </MDTypography>
                          <MDTypography variant="button" color="text" display="block" mt={0.25}>
                            {doctor.specialty || "Mjek"}
                          </MDTypography>
                          <MDTypography
                            variant="caption"
                            color="text"
                            display="block"
                            mt={0.75}
                            sx={{ fontSize: "0.85rem" }}
                          >
                            {doctor.email}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    );
                  })
                ) : (
                  <MDTypography variant="caption" color="text">
                    Nuk u ngarkuan mjekët. Kontrolloni backend-in.
                  </MDTypography>
                )}
              </MDBox>

              {selectedDoctor ? (
                <MDBox
                  mt={2}
                  p={2}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                  }}
                >
                  <MDTypography variant="caption" color="text" display="block" mb={1}>
                    Kredencialet për <strong>{selectedDoctor.fullName}</strong>
                  </MDTypography>
                  <MDBox mb={1.5}>
                    <MDInput
                      type="email"
                      label="Email"
                      fullWidth
                      value={email}
                      InputProps={{ readOnly: true }}
                      sx={{
                        "& .MuiInputBase-root": { minHeight: 52, fontSize: "1rem" },
                      }}
                    />
                  </MDBox>
                  <MDBox>
                    <MDInput
                      type="text"
                      label="Fjalëkalimi"
                      fullWidth
                      value={password}
                      InputProps={{ readOnly: true }}
                      sx={{
                        "& .MuiInputBase-root": { minHeight: 52, fontSize: "1rem" },
                      }}
                    />
                  </MDBox>
                </MDBox>
              ) : null}
            </MDBox>
          ) : (
            <>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@shembull.com"
                  sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Fjalëkalimi"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Fjalëkalimi i regjistrimit"
                  sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
                />
              </MDBox>
              <MDTypography variant="caption" color="text" display="block" mb={2}>
                Pa llogari? Lini email-in bosh për hyrje si vizitor, ose regjistrohuni më poshtë.
              </MDTypography>
            </>
          )}

          {error ? (
            <MDTypography variant="caption" color="error" display="block" mb={1}>
              {error}
            </MDTypography>
          ) : null}
          <MDButton
            type="submit"
            variant="gradient"
            color="info"
            fullWidth
            disabled={loading || (role === "DOCTOR" && !selectedDoctor)}
            sx={{ py: 1.2, fontSize: "0.95rem" }}
          >
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

        {role === "ADMIN" ? (
          <MDBox mt={2}>
            <MDTypography variant="caption" color="text">
              Hyrja e administrimit lidhet me llogarinë kryesore të faqes (një administrator).
            </MDTypography>
          </MDBox>
        ) : null}
      </Card>
    </HospitalAuthLayout>
  );
}
