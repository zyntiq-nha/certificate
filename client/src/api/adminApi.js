import { adminApiClient } from "./client";

export const adminApi = {
  login(payload) {
    return adminApiClient.post("/admin/login", payload);
  }
};
