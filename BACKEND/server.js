const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// =====================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// =====================================================

dotenv.config();

// =====================================================
// IMPORTS
// =====================================================

const connectDB = require("./config/db");

const walletRoutes = require("./routes/walletRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

// =====================================================
// CONNECT DATABASE
// =====================================================

connectDB();

// =====================================================
// CREATE APP
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/wallet", walletRoutes);

app.use("/api/expenses", expenseRoutes);

// =====================================================
// FRONTEND
// =====================================================

// Project structure:
//
// Budget
// ├── BACKEND
// │   └── server.js
// │
// └── FRONTEND
//     ├── index.html
//     ├── script.js
//     └── style.css
//
// Since server.js is inside BACKEND,
// ../FRONTEND points to the frontend folder.

const frontendPath = path.join(
    __dirname,
    "../FRONTEND"
);

// Serve CSS, JS, images, etc.
app.use(express.static(frontendPath));

// Home page
app.get("/", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "index.html")
    );
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Expense Tracker API is running"
    });
});

// =====================================================
// API 404
// =====================================================

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Server running on port ${PORT}`
    );
});
