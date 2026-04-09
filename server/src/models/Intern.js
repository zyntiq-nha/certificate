const mongoose = require("mongoose");
const { CERT_TYPE_KEYS } = require("../constants/certTypes");

const certificateSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: CERT_TYPE_KEYS,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    certificateId: {
      type: String,
      required: true,
      trim: true
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    qrCodeUrl: {
      type: String,
      trim: true
    }
  },
  {
    _id: false
  }
);

const internSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true
    },
    certificates: {
      type: [certificateSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

internSchema.index({ email: 1, fullName: 1 });
internSchema.index({ "certificates.certificateId": 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Intern", internSchema);
