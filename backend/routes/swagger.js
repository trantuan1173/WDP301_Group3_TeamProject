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
        url: '/api', 
      },
    ],
  },
  apis: ['./routes/userRoutes.js', './routes/profileRoutes.js', './routes/roleRoutes.js', './routes/courseRoutes.js', './routes/courseDetailRoutes.js', './routes/enrollmentRoutes.js', './routes/classRoutes.js', './routes/scheduleRoutes.js', './routes/attendanceRoutes.js', './routes/testRoutes.js', './routes/testAssignRoutes.js', './routes/testSubmissionRoutes.js', './routes/feedbackRoutes.js', './routes/paymentRoutes.js', './routes/customerConsultingRoutes.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;