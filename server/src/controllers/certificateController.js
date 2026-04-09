const Intern = require("../models/Intern");
const { createCertificatePdf } = require("../utils/pdfCertificate");
const {
  escapeRegex,
  isValidCertificateId,
  isValidEmail,
  normalizeEmail,
  normalizeName
} = require("../utils/validators");
const getPublicBaseUrl = (req) => {
  const configured = process.env.PUBLIC_BASE_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  return `${req.protocol}://${req.get("host")}`;
};
const getVerificationUrl = (req, certificateId, existingUrl) => {
  // Ignore existingUrl if it exists because it might contain stale 'localhost' links from dev
  // Prioritize the configured FRONTEND_BASE_URL
  const frontendBaseUrl = process.env.FRONTEND_BASE_URL;
  if (frontendBaseUrl) {
    return `${frontendBaseUrl.replace(/\/$/, "")}/verify/${certificateId}`;
  }

  return `${getPublicBaseUrl(req)}/api/verify/${certificateId}`;
};
const toPublicCertificate = (certificate) => ({
  type: certificate.type,
  title: certificate.title,
  certificateId: certificate.certificateId,
  issuedAt: certificate.issuedAt
});

const findCertificates = async (req, res, next) => {
  try {
    const fullName = normalizeName(req.body.fullName);
    const email = normalizeEmail(req.body.email);

    if (!fullName || !email) {
      return res.status(400).json({ message: "fullName and email are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const intern = await Intern.findOne(
      {
        fullName: { $regex: `^${escapeRegex(fullName)}$`, $options: "i" },
        email
      },
      { fullName: 1, email: 1, certificates: 1 }
    ).lean();

    if (!intern) {
      return res.status(404).json({ message: "No certificates found for this user" });
    }

    return res.json({
      intern: {
        id: intern._id,
        fullName: intern.fullName,
        email: intern.email
      },
      certificates: (intern.certificates || []).map(toPublicCertificate)
    });
  } catch (error) {
    return next(error);
  }
};

const getCertificateById = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    if (!isValidCertificateId(certificateId)) {
      return res.status(400).json({ message: "Invalid certificate id" });
    }

    const intern = await Intern.findOne(
      { "certificates.certificateId": certificateId },
      { fullName: 1, email: 1, certificates: 1 }
    ).lean();

    if (!intern) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const certificate = (intern.certificates || []).find((c) => c.certificateId === certificateId);

    return res.json({
      certificate: certificate ? toPublicCertificate(certificate) : null,
      intern: {
        id: intern._id,
        fullName: intern.fullName,
        email: intern.email
      }
    });
  } catch (error) {
    return next(error);
  }
};

const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    if (!isValidCertificateId(certificateId)) {
      return res.status(400).json({
        status: "invalid",
        message: "Invalid certificate id"
      });
    }

    const intern = await Intern.findOne(
      { "certificates.certificateId": certificateId },
      { fullName: 1, certificates: 1 }
    ).lean();

    if (!intern) {
      return res.status(404).json({
        status: "invalid",
        message: "Certificate not found"
      });
    }

    const certificate = (intern.certificates || []).find((c) => c.certificateId === certificateId);

    if (!certificate) {
      return res.status(404).json({
        status: "invalid",
        message: "Certificate not found"
      });
    }

    return res.json({
      status: "valid",
      certificateId,
      fullName: intern.fullName,
      type: certificate.type,
      title: certificate.title,
      issuedAt: certificate.issuedAt
    });
  } catch (error) {
    return next(error);
  }
};

const generateCertificatePdf = async (req, res, next) => {
  try {
    const { certificateId } = req.params;
    if (!isValidCertificateId(certificateId)) {
      return res.status(400).json({ message: "Invalid certificate id" });
    }
    const intern = await Intern.findOne(
      { "certificates.certificateId": certificateId },
      { fullName: 1, certificates: 1 }
    ).lean();

    if (!intern) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const certificate = (intern.certificates || []).find((c) => c.certificateId === certificateId);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const verificationUrl = getVerificationUrl(req, certificate.certificateId, certificate.qrCodeUrl);
    const pdfBytes = await createCertificatePdf({
      fullName: intern.fullName,
      certificate,
      verificationUrl
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${certificate.certificateId}.pdf"`
    );
    return res.send(Buffer.from(pdfBytes));
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  findCertificates,
  generateCertificatePdf,
  getCertificateById,
  verifyCertificate
};
