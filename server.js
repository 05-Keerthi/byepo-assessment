require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// Connect Database
connectDB();

// Use PORT from .env or fallback
const PORT = process.env.PORT || 5000;

// Optional: define base URL
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`🚀 Server running at: ${BASE_URL}`);
  console.log(`📘 Swagger Docs: ${BASE_URL}/api-docs`);
});
