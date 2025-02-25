const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/healthRoutes');

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);  // ✅ Fix: Correct routing

app.get('/', (req, res) => {
    res.send("API is running... :)");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);
