import { publicApi } from "./client";

export const certificateApi = {
  findByNameEmail(payload) {
    return publicApi.post("/certificates/find", payload);
  },
  getById(certificateId) {
    return publicApi.get(`/certificate/${certificateId}`);
  },
  verifyById(certificateId) {
    return publicApi.get(`/verify/${certificateId}`);
  }
};
