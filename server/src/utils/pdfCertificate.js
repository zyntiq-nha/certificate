const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const templateConfig = require("./templateConfig");

const formatDate = (value) => {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(value));
  } catch (error) {
    return String(value);
  }
};

/**
 * Calculates a font size that fits within the maxWidth
 */
const getAdjustedFontSize = (text, font, initialSize, maxWidth) => {
  let size = initialSize;
  let textWidth = font.widthOfTextAtSize(text, size);
  while (textWidth > maxWidth && size > 10) {
    size -= 1;
    textWidth = font.widthOfTextAtSize(text, size);
  }
  return size;
};

/**
 * Draws text with optional centering
 */
const drawText = (page, text, font, size, pos, color) => {
  let x = pos.x;
  if (pos.centered) {
    const textWidth = font.widthOfTextAtSize(text, size);
    x = pos.x - (textWidth / 2);
  }
  
  page.drawText(text, {
    x,
    y: pos.y,
    size,
    font,
    color,
  });
};

const createCertificatePdf = async ({ fullName, certificate, verificationUrl }) => {
  // 1. Identify which template to use
  // DB stores types as lowercase e.g. 'ca', 'ta_2', 'ex'
  // Config keys are uppercase e.g. 'CA', 'TA_2', 'EX'
  // Only insert underscore if the type has letters followed directly by a digit (e.g. 'ta2' → 'TA_2')
  // If underscore already exists (e.g. 'ta_2'), just uppercase it directly.
  const rawType = String(certificate.type).toUpperCase();
  const typeKey = rawType.includes('_') ? rawType : rawType.replace(/([A-Z])(\d)/, '$1_$2');
  const config = templateConfig.templates[typeKey] || templateConfig.default;
  const common = templateConfig.common;
  
  console.log(`[PDF] type="${certificate.type}" → key="${typeKey}" → template="${config.file}"`);


  // 2. Find the template file (case-insensitive)
  const templatesDir = path.join(__dirname, "..", "assets", "templates");
  
  const findTemplate = (filename) => {
    const files = fs.readdirSync(templatesDir);
    const match = files.find(f => f.toLowerCase() === filename.toLowerCase());
    return match ? path.join(templatesDir, match) : null;
  };

  let templateBytes;
  const templateFile = findTemplate(config.file);
  
  if (templateFile) {
    templateBytes = fs.readFileSync(templateFile);
  } else {
    console.error(`Template "${config.file}" not found. Falling back to default.`);
    const fallbackFile = findTemplate(templateConfig.default.file);
    if (!fallbackFile) throw new Error("Default template not found in templates directory.");
    templateBytes = fs.readFileSync(fallbackFile);
  }

  // 3. Initialize PDF
  const templateDoc = await PDFDocument.load(templateBytes);
  const pdf = await PDFDocument.create();
  
  // Set dimensions based on orientation
  // A4 Landscape: 841.89 x 595.28 | A4 Portrait: 595.28 x 841.89
  const pageDims = config.isPortrait ? [595.28, 841.89] : [841.89, 595.28];
  
  // Copy pages from template
  const [templatePage] = await pdf.copyPages(templateDoc, [0]);
  const page = pdf.addPage(pageDims);
  
  // Draw the template onto the new page
  const embeddedPage = await pdf.embedPage(templatePage);
  page.drawPage(embeddedPage, {
    x: 0,
    y: 0,
    width: pageDims[0],
    height: pageDims[1],
  });
  
  const width = page.getWidth();
  const height = page.getHeight();

  // 4. Embed Fonts
  const titleFont = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  const strongFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  const textConfigColor = config.fontColor || common.fontColor;
  const textColor = rgb(textConfigColor.r, textConfigColor.g, textConfigColor.b);

  // 5. Overlay Dynamic Data
  // Name (with auto-adjust for length)
  const maxNameWidth = width * 0.75; // Allow name to take up to 75% of page width
  const adjustedNameSize = getAdjustedFontSize(fullName, titleFont, config.namePos.size, maxNameWidth);
  drawText(page, fullName, titleFont, adjustedNameSize, config.namePos, textColor);

  // Date
  drawText(page, formatDate(certificate.issuedAt), bodyFont, config.datePos.size, config.datePos, textColor);

  // Certificate ID (UID)
  drawText(page, certificate.certificateId, bodyFont, config.idPos.size, config.idPos, textColor);

  // 6. QR Code
  const qrPos = config.qrPos || common.qrPos;
  const qrSize = config.qrSize || common.qrSize;

  const qrDataUrl = await QRCode.toDataURL(verificationUrl, { margin: 1 });
  const qrBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdf.embedPng(qrBytes);
  
  page.drawImage(qrImage, {
    x: qrPos.x,
    y: qrPos.y,
    width: qrSize,
    height: qrSize
  });

  return pdf.save();
};

module.exports = {
  createCertificatePdf
};
