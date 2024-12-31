require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    console.log("Trying to connect to DB", process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', {
            message: error.message,
            stack: error.stack,
            uri: process.env.MONGO_URI,
        });
        process.exit(1);
    }
};

module.exports = connectDB;
