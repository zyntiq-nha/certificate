const CERT_TYPES = {
  ta_1: "TA 1 Month",
  ta_2: "TA 2 Month",
  ta_4: "TA 4 Month",
  ta_6: "TA 6 Month",
  ex: "Excellence",
  ap: "Appreciation",
  ca: "Campus Ambassador",
  bl: "Best Leader",
  bp: "Best Performer",
  fsd_2m: "Full Stack Developer (2 Month)",
  ma_2m: "Marketing (2 Month)",
  bda_2m: "Business Development Associate (2 Month)",
  tasm_2: "TASM 2 Month",
  tasm_4: "TASM 4 Month"
};

const CERT_TYPE_KEYS = Object.keys(CERT_TYPES);

module.exports = {
  CERT_TYPES,
  CERT_TYPE_KEYS
};
