const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json());

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/orgs", require("./routes/organizationRoutes"));
app.use("/api/features", require("./routes/featureRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

module.exports = app;
