const { CERT_TYPES } = require("../constants/certTypes");
const Counter = require("../models/Counter");

const buildCertificateId = ({ type, sequence }) => {
  const normalizedType = String(type || "").toUpperCase();
  const seq = String(sequence).padStart(6, "0");
  return `ZYNTIQ-${normalizedType}-${seq}`;
};

const nextCertificateSequence = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "certificate_global_sequence",
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return counter.seq;
};

const buildVerificationUrl = (certificateId) => {
  const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "";
  if (frontendBaseUrl) {
    return `${frontendBaseUrl.replace(/\/$/, "")}/verify/${certificateId}`;
  }

  const publicBaseUrl = process.env.PUBLIC_BASE_URL || "";
  if (!publicBaseUrl) {
    return `/api/verify/${certificateId}`;
  }

  return `${publicBaseUrl.replace(/\/$/, "")}/api/verify/${certificateId}`;
};

const mapTypeToTitle = (type) => {
  return CERT_TYPES[type] || "Certificate";
};

module.exports = {
  buildCertificateId,
  buildVerificationUrl,
  mapTypeToTitle,
  nextCertificateSequence
};
