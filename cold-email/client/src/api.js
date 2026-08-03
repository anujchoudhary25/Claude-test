const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // leads
  getLeads: (status) => request(`/leads${status ? `?status=${status}` : ""}`),
  addLead: (lead) => request("/leads", { method: "POST", body: JSON.stringify(lead) }),
  importLeads: (leads) => request("/leads/import", { method: "POST", body: JSON.stringify({ leads }) }),
  updateLead: (id, patch) => request(`/leads/${id}`, { method: "PUT", body: JSON.stringify(patch) }),
  deleteLead: (id) => request(`/leads/${id}`, { method: "DELETE" }),

  // templates
  getTemplates: () => request("/templates"),
  addTemplate: (t) => request("/templates", { method: "POST", body: JSON.stringify(t) }),
  updateTemplate: (id, patch) => request(`/templates/${id}`, { method: "PUT", body: JSON.stringify(patch) }),
  deleteTemplate: (id) => request(`/templates/${id}`, { method: "DELETE" }),

  // campaign
  eligibleCount: () => request("/campaign/eligible-count"),
  sendBatch: (payload) => request("/campaign/send-batch", { method: "POST", body: JSON.stringify(payload || {}) }),
  checkReplies: () => request("/campaign/check-replies", { method: "POST" }),

  // stats
  getOverview: () => request("/stats/overview"),
  getDaily: (days) => request(`/stats/daily${days ? `?days=${days}` : ""}`),
  getRecentSends: () => request("/stats/recent-sends"),

  // settings
  getSettings: () => request("/settings"),
  updateSettings: (patch) => request("/settings", { method: "PUT", body: JSON.stringify(patch) }),

  // auth
  getGmailUrl: () => request("/auth/gmail/url"),
  getGmailStatus: () => request("/auth/gmail/status"),
  disconnectGmail: () => request("/auth/gmail/disconnect", { method: "POST" }),
};
