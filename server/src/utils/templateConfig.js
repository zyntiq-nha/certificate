/**
 * Configuration for different certificate templates.
 * 
 * Page Dimensions:
 * - Landscape A4: 841.89 x 595.28 points (~29.7cm x 21.0cm)
 * - Portrait A4: 595.28 x 841.89 points (~21.0cm x 29.7cm)
 * 
 * Formula for CM to PDF Points (Bottom-Left Origin):
 * - X_pt = X_cm * 28.346
 * - Y_pt = PageHeight_pt - (Y_cm * 28.346)
 */

const templateConfig = {
  common: {
    fontColor: { r: 0.05, g: 0.09, b: 0.16 },
    qrSize: 70, // Standardized compact size
    qrPos: { x: 700, y: 55 },
  },

  templates: {
    // === LANDSCAPE TEMPLATES (Height: 595.28) ===

    AP: {
      file: "AP.pdf",
      namePos: { x: 248, y: 356, size: 28, centered: false }, // X:8.75cm, Y:8.42cm
      titlePos: { x: 421, y: 220, size: 20, centered: true },
      datePos: { x: 125, y: 59, size: 12, centered: false },  // X:4.4cm, Y:18.9cm
      idPos: { x: 125, y: 39, size: 12, centered: false },    // Y extrapolated
      qrPos: { x: 362, y: 173, size: 70 },                  // X:12.77cm, Y:14.89cm
    },

    BL: {
      file: "BL.pdf",
      namePos: { x: 70, y: 303, size: 45, centered: false },  // X:1.93cm, Y:8.12cm
      titlePos: { x: 421, y: 230, size: 20, centered: true },
      datePos: { x: 315, y: 55, size: 12, centered: false },  // X:10.64cm, Y:18.36cm
      idPos: { x: 315, y: 26, size: 12, centered: false },    // Y extrapolated
      qrPos: { x: 500, y: 30, size: 70 },                  // X:16.95cm, Y:17.08cm
    },

    CA: {
      file: "CA.pdf",
      namePos: { x: 421, y: 290, size: 38, centered: true }, // Centered under 'awarded to'
      datePos: { x: 650, y: 70, size: 11, centered: false }, // More right, higher than UID
      idPos: { x: 650, y: 43, size: 11, centered: false },   // Aligned right with Date
      qrPos: { x: 400, y: 45, size: 70 },                  // Adjusted horizontally
    },

    // TA Templates (Landscape)
    TA_1: {
      file: "TA1.pdf",
      namePos: { x: 290, y: 305, size: 28, centered: false },
      titlePos: { x: 421, y: 230, size: 20, centered: true },
      datePos: { x: 705, y: 70, size: 12, centered: false },
      idPos: { x: 705, y: 43, size: 12, centered: false },
      qrPos: { x: 400, y: 45, size: 70 },
    },
    TA_2: {
      file: "TA2.pdf",
      namePos: { x: 290, y: 305, size: 28, centered: false },
      titlePos: { x: 421, y: 230, size: 20, centered: true },
      datePos: { x: 705, y: 70, size: 12, centered: false },
      idPos: { x: 705, y: 43, size: 12, centered: false },
      qrPos: { x: 400, y: 45, size: 70 },
    },
    TA_4: {
      file: "TA4.pdf",
      namePos: { x: 290, y: 305, size: 28, centered: false },
      titlePos: { x: 421, y: 230, size: 20, centered: true },
      datePos: { x: 705, y: 70, size: 12, centered: false },
      idPos: { x: 705, y: 43, size: 12, centered: false },
      qrPos: { x: 400, y: 45, size: 70 },
    },

    // === PORTRAIT TEMPLATES (Height: 841.89) ===

    EX: {
      file: "EX.pdf",
      isPortrait: true,
      namePos: { x: 180, y: 500, size: 35, centered: false },   // X:1.96cm, Y:7.72cm
      titlePos: { x: 298, y: 500, size: 20, centered: true },
      datePos: { x: 463, y: 54, size: 12, centered: false },  // X:10.95cm, Y:19.06cm
      idPos: { x: 463, y: 20, size: 12, centered: false },    // Y extrapolated
      qrPos: { x: 430, y: 120, size: 30 },                    // X:10.15cm, Y:16.17cm
    },

    BP: {
      file: "BP.pdf",
      isPortrait: true,
      fontColor: { r: 1, g: 1, b: 1 },
      namePos: { x: 76, y: 480, size: 32, centered: false },    // X:0.17cm, Y:8.56cm
      titlePos: { x: 294, y: 480, size: 20, centered: true },
      datePos: { x: 118, y: 67, size: 12, centered: false },   // X:2.53cm, Y:18.75cm
      idPos: { x: 118, y: 33, size: 12, centered: false },     // Y extrapolated
      qrPos: { x: 300, y: 30, size: 50 },                    // X:7.52cm, Y:18.31cm
    },
  },

  default: {
    file: "EX.pdf",
    isPortrait: true,
    namePos: { x: 56, y: 623, size: 28, centered: false },
    titlePos: { x: 298, y: 500, size: 20, centered: true },
    datePos: { x: 310, y: 301, size: 12, centered: false },
    idPos: { x: 310, y: 281, size: 12, centered: false },
    qrPos: { x: 288, y: 384, size: 40 },
  }
};

module.exports = templateConfig;
