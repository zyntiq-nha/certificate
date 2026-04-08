require("dotenv").config();
const mongoose = require("mongoose");
const Intern = require("./src/models/Intern");

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const interns = await Intern.find({});
    console.log(`Found ${interns.length} interns.`);

    for (const intern of interns) {
      let modified = false;

      // Update certificate IDs from UPLERN to ZYNTIQ
      if (intern.certificates && intern.certificates.length > 0) {
        intern.certificates.forEach(cert => {
          if (cert.certificateId && cert.certificateId.toUpperCase().includes("UPLERN")) {
            // "UPLERN CA 000011" -> "ZYNTIQ-CA-000011"
            cert.certificateId = cert.certificateId
                                     .replace(/UPLERN/i, "ZYNTIQ")
                                     .replace(/ /g, "-");
            modified = true;
          }
        });
      }

      if (modified) {
        await intern.save();
        console.log(`Updated certificates for intern: ${intern.fullName}`);
      }
    }

    console.log("Migration completed.");
    process.exit(0);

  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateData();
