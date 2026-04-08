const mongoose = require("mongoose");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CERTIFICATE_ID_REGEX = /^[A-Z0-9][A-Z0-9 _-]{3,}[0-9]+$/i;

const normalizeEmail = (email) => String(email || "").toLowerCase().trim();
const normalizeName = (name) => String(name || "").replace(/\s+/g, " ").trim();

const isValidEmail = (email) => EMAIL_REGEX.test(normalizeEmail(email));
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ""));
const isValidCertificateId = (value) => CERTIFICATE_ID_REGEX.test(String(value || "").trim());

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = {
  escapeRegex,
  isValidCertificateId,
  isValidEmail,
  isValidObjectId,
  normalizeEmail,
  normalizeName
};
