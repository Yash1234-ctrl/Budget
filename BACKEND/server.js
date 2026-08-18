const express = require("express");
const path = require("path");
const dotenv = require("dotenv");


// Load environment variables FIRST

dotenv.config();


const connectDB =
    require("./config/db");


const walletRoutes =
    require("./routes/walletRoutes");


const expenseRoutes =
    require("./routes/expenseRoutes");


// Connect MongoDB

connectDB();


const app =
    express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    express.json()
);


// =====================================================
// API ROUTES
// =====================================================

app.use(
    "/api/wallet",
    walletRoutes
);


app.use(
    "/api/expenses",
    expenseRoutes
);


// =====================================================
// FRONTEND
// =====================================================

const frontendPath =
    path.join(
        __dirname,
        "../frontend"
    );


app.use(
    express.static(
        frontendPath
    )
);


app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                frontendPath,
                "index.html"
            )
        );

    }
);


// =====================================================
// HEALTH
// =====================================================

app.get(
    "/health",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Expense Tracker API is running"

        });

    }
);


// =====================================================
// API 404
// =====================================================

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API endpoint not found"

        });

    }
);


// =====================================================
// GLOBAL ERROR
// =====================================================

app.use(
    (err, req, res, next) => {

        console.error(err);

        res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }
);


// =====================================================
// SERVER
// =====================================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);