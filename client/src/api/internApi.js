import { api } from "./client";

export const internApi = {
  list({ page = 1, limit = 10, search = "" }) {
    return api.get("/interns", {
      params: { page, limit, search: search || undefined }
    });
  },
  create(payload) {
    return api.post("/interns", payload);
  },
  update(id, payload) {
    return api.put(`/interns/${id}`, payload);
  },
  remove(id) {
    return api.delete(`/interns/${id}`);
  }
};
