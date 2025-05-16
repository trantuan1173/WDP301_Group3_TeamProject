const express=require('express');
const router=require('./routes/index.js');
const connectDB = require('./config/db.js');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
const cors = require('cors');

connectDB();
const app=express();
dotenv.config();
app.use(cors());

app.use(express.json());
app.use('/',router);

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});
