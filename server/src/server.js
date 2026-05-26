require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const port = Number(process.env.PORT || 5000);
const maxRetries = Number(process.env.DB_CONNECT_MAX_RETRIES || 30);
const retryDelayMs = Number(process.env.DB_CONNECT_RETRY_MS || 5000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const start = async () => {
  let connected = false;
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await connectDB();
      connected = true;
      break;
    } catch (error) {
      console.error(`DB connect failed (attempt ${attempt}/${maxRetries}):`, error.message);
      if (attempt < maxRetries) {
        await sleep(retryDelayMs);
      }
    }
  }

  if (!connected) {
    console.error("Failed to connect DB after max retries. Exiting.");
    process.exit(1);
  }

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
  });
};

start();
