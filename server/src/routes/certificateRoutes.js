const express = require("express");
const {
  findCertificates,
  generateCertificatePdf,
  getCertificateById,
  verifyCertificate
} = require("../controllers/certificateController");

const router = express.Router();

router.post("/certificates/find", findCertificates);
router.get("/certificate/:certificateId", getCertificateById);
router.get("/verify/:certificateId", verifyCertificate);
router.get("/certificate/generate/:certificateId", generateCertificatePdf);

module.exports = router;
