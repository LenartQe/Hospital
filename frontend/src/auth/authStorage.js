const KEY = "hospital_auth";

export function getAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function getAuthHeader() {
  const auth = getAuth();
  if (!auth?.token) return {};
  return { Authorization: `Bearer ${auth.token}` };
}

export function homeRouteForRole(role) {
  if (role === "PATIENT") return "/patient/dashboard";
  if (role === "DOCTOR") return "/doctor/dashboard";
  return "/dashboard";
}
