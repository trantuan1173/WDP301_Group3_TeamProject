const dotenv= require('dotenv');
dotenv.config();
const express=require('express');
const router=require('./routes/index.js');
const connectDB = require('./config/db.js');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./routes/swagger.js');
require("./cron/classProgressCron");

connectDB();
const app=express();

app.use(cors());
// const corsOptions = {
//     origin: 'https://englishcenter.gicunhco.com',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
//   };
  
//   app.use(cors(corsOptions));
//   app.options(/.*/, cors(corsOptions));


app.use(express.json());
app.use('/api',router);
// Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});
