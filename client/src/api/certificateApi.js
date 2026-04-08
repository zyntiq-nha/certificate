import { api } from "./client";

export const certificateApi = {
  findByNameEmail(payload) {
    return api.post("/certificates/find", payload);
  },
  getById(certificateId) {
    return api.get(`/certificate/${certificateId}`);
  },
  verifyById(certificateId) {
    return api.get(`/verify/${certificateId}`);
  }
};
