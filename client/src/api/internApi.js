import { adminApiClient } from "./client";

export const internApi = {
  list({ page = 1, limit = 10, search = "" }) {
    return adminApiClient.get("/interns", {
      params: { page, limit, search: search || undefined }
    });
  },
  create(payload) {
    return adminApiClient.post("/interns", payload);
  },
  update(id, payload) {
    return adminApiClient.put(`/interns/${id}`, payload);
  },
  remove(id) {
    return adminApiClient.delete(`/interns/${id}`);
  }
};
