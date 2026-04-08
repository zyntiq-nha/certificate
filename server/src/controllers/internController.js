const Intern = require("../models/Intern");
const { CERT_TYPE_KEYS } = require("../constants/certTypes");
const {
  buildCertificateId,
  buildVerificationUrl,
  mapTypeToTitle,
  nextCertificateSequence
} = require("../utils/certificate");
const {
  escapeRegex,
  isValidEmail,
  isValidObjectId,
  normalizeEmail,
  normalizeName
} = require("../utils/validators");

const normalizeCertificateTypes = (certificates) => {
  if (!Array.isArray(certificates)) {
    return { unique: [], invalid: [] };
  }

  const inputTypes = certificates
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }
      if (item && typeof item === "object" && item.type) {
        return String(item.type).trim();
      }
      return "";
    })
    .filter(Boolean);

  const unique = [...new Set(inputTypes)];
  const invalid = unique.filter((type) => !CERT_TYPE_KEYS.includes(type));

  return { unique, invalid };
};

const buildNewCertificateEntry = async (type) => {
  const sequence = await nextCertificateSequence();
  const certificateId = buildCertificateId({ type, sequence });

  return {
    type,
    title: mapTypeToTitle(type),
    certificateId,
    issuedAt: new Date(),
    qrCodeUrl: buildVerificationUrl(certificateId)
  };
};

const getDuplicateMessage = (error, fallbackMessage) => {
  const keyPattern = error?.keyPattern || {};
  if (keyPattern.email) {
    return "An intern with this email already exists";
  }
  if (keyPattern["certificates.certificateId"] || keyPattern.certificateId) {
    return "Certificate generation conflict. Please try again.";
  }
  return fallbackMessage;
};

const getInterns = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
    const search = String(req.query.search || "").trim();

    const safeSearch = search ? escapeRegex(search).slice(0, 80) : "";

    const filter = safeSearch
      ? {
          $or: [
            { fullName: { $regex: safeSearch, $options: "i" } },
            { email: { $regex: safeSearch, $options: "i" } },
            { "certificates.certificateId": { $regex: safeSearch, $options: "i" } }
          ]
        }
      : {};

    const [items, total] = await Promise.all([
      Intern.find(filter)
        .select("_id fullName email certificates.type certificates.certificateId createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Intern.countDocuments(filter)
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      items
    });
  } catch (error) {
    return next(error);
  }
};

const createIntern = async (req, res, next) => {
  try {
    const fullName = normalizeName(req.body.fullName);
    const email = normalizeEmail(req.body.email);

    if (!fullName || !email) {
      return res.status(400).json({ message: "fullName and email are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const parsed = normalizeCertificateTypes(req.body.certificates);
    if (parsed.invalid.length > 0) {
      return res.status(400).json({
        message: `Invalid certificate types: ${parsed.invalid.join(", ")}`
      });
    }

    const certificates = await Promise.all(parsed.unique.map((type) => buildNewCertificateEntry(type)));
    const intern = await Intern.create({ fullName, email, certificates });

    return res.status(201).json(intern);
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({
        message: getDuplicateMessage(error, "Duplicate key conflict")
      });
    }
    return next(error);
  }
};

const updateIntern = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid intern id" });
    }
    const existingIntern = await Intern.findById(id);

    if (!existingIntern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    const fullName = req.body.fullName !== undefined ? normalizeName(req.body.fullName) : existingIntern.fullName;
    const email = req.body.email !== undefined ? normalizeEmail(req.body.email) : existingIntern.email;

    if (!fullName || !email) {
      return res.status(400).json({ message: "fullName and email are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    let certificates = existingIntern.certificates;
    if (req.body.certificates !== undefined) {
      const parsed = normalizeCertificateTypes(req.body.certificates);
      if (parsed.invalid.length > 0) {
        return res.status(400).json({
          message: `Invalid certificate types: ${parsed.invalid.join(", ")}`
        });
      }

      const existingByType = new Map(existingIntern.certificates.map((c) => [c.type, c]));
      certificates = await Promise.all(
        parsed.unique.map(async (type) => {
          if (existingByType.has(type)) {
            return existingByType.get(type);
          }
          return buildNewCertificateEntry(type);
        })
      );
    }

    existingIntern.fullName = fullName;
    existingIntern.email = email;
    existingIntern.certificates = certificates;
    await existingIntern.save();

    return res.json(existingIntern);
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({
        message: getDuplicateMessage(error, "Duplicate key conflict")
      });
    }
    return next(error);
  }
};

const deleteIntern = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid intern id" });
    }
    const deleted = await Intern.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Intern not found" });
    }

    return res.json({ message: "Intern deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createIntern,
  deleteIntern,
  getInterns,
  updateIntern
};
