require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "html", "index.html"));
});

app.use("/api/vendors", vendorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Aurora backend running on port ${PORT}`);
            console.log(`MongoDB database: aurora`);
        });
    } catch (error) {
        console.error("Aurora backend stopped because MongoDB could not connect.");
        console.error("Check that MongoDB is running and backend/.env contains a valid MONGO_URI.");
        process.exit(1);
    }
}

startServer();
