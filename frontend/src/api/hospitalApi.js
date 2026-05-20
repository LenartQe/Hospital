import { getAuthHeader } from "auth/authStorage";

const API_BASE = process.env.REACT_APP_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const hospitalApi = {
  auth: {
    login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    registerPatient: (body) =>
      request("/api/auth/register/patient", { method: "POST", body: JSON.stringify(body) }),
  },
  patient: {
    dashboard: () => request("/api/patient/dashboard"),
  },
  doctor: {
    dashboard: () => request("/api/doctor/dashboard"),
    appointments: () => request("/api/doctor/appointments"),
    updateAppointmentStatus: (id, status) =>
      request(`/api/doctor/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    diagnoses: () => request("/api/doctor/diagnoses"),
    prescriptions: () => request("/api/doctor/prescriptions"),
    profile: () => request("/api/doctor/profile"),
    patients: () => request("/api/doctor/patients"),
    addDiagnosis: (patientId, body) =>
      request(`/api/doctor/patients/${patientId}/diagnoses`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    addPrescription: (patientId, body) =>
      request(`/api/doctor/patients/${patientId}/prescriptions`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  stats: () => request("/api/stats"),
  departments: {
    list: () => request("/api/departments"),
    get: (id) => request(`/api/departments/${id}`),
    create: (body) => request("/api/departments", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      request(`/api/departments/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id) => request(`/api/departments/${id}`, { method: "DELETE" }),
  },
  doctors: {
    list: (departmentId) => {
      const q = departmentId != null ? `?departmentId=${departmentId}` : "";
      return request(`/api/doctors${q}`);
    },
    get: (id) => request(`/api/doctors/${id}`),
    create: (body) => request("/api/doctors", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      request(`/api/doctors/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id) => request(`/api/doctors/${id}`, { method: "DELETE" }),
  },
  medicines: {
    list: () => request("/api/medicines"),
    get: (id) => request(`/api/medicines/${id}`),
    create: (body) => request("/api/medicines", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) =>
      request(`/api/medicines/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id) => request(`/api/medicines/${id}`, { method: "DELETE" }),
  },
  appointments: {
    list: () => request("/api/appointments"),
    create: (body) => request("/api/appointments", { method: "POST", body: JSON.stringify(body) }),
    updateStatus: (id, status) =>
      request(`/api/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },
};
