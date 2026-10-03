const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error(
            "MONGO_URI is missing. Create backend/.env with MONGO_URI=mongodb://127.0.0.1:27017/aurora"
        );
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("MongoDB connected successfully.");
        return true;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

module.exports = connectDB;
