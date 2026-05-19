// Empty base uses the CRA dev-server proxy (package.json) to Spring Boot (see server.port, e.g. :8082).
// Set REACT_APP_API_URL when the API is not proxied (e.g. production static hosting).
const API_BASE = process.env.REACT_APP_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
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
