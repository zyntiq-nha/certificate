require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const port = Number(process.env.PORT || 5000);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
