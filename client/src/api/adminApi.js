import { api } from "./client";

export const adminApi = {
  login(payload) {
    return api.post("/admin/login", payload);
  }
};
