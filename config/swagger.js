const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Multi-Tenant Feature Flag Management System API",
      version: "1.0.0",
      description: "API documentation for Multi-Tenant Feature Flag Management System"
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ],

    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Organizations", description: "Organization Management APIs" },
      { name: "Users", description: "User Management APIs" },
      { name: "Features", description: "Feature Flag APIs" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./routes/*.js"] // scan route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
