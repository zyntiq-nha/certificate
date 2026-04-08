require("dotenv").config();
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const run = async () => {
  const email = String(process.argv[2] || "").toLowerCase().trim();
  const password = String(process.argv[3] || "");

  if (!email || !password) {
    // eslint-disable-next-line no-console
    console.error("Usage: npm run create:admin -- <email> <password>");
    process.exit(1);
  }

  if (password.length < 8) {
    // eslint-disable-next-line no-console
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email });
  if (existing) {
    // eslint-disable-next-line no-console
    console.error("Admin already exists for this email.");
    process.exit(1);
  }

  await Admin.create({ email, password });
  // eslint-disable-next-line no-console
  console.log(`Admin created: ${email}`);
  process.exit(0);
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to create admin:", error.message);
  process.exit(1);
});
