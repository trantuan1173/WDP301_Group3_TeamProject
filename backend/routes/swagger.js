// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API quản lý',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Không bắt buộc, nhưng nên có
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:9999/api', 
      },
    ],
  },
  apis: ['./routes/userRoutes.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;