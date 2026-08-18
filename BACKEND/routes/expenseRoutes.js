const express = require("express");

const {
    addExpense,
    getExpenses,
    getTodayExpenses,
    getMonthlyAnalysis,
    getDateWiseAnalysis,
    deleteExpense
} = require("../controllers/expenseController");

const router = express.Router();


router.post(
    "/",
    addExpense
);


router.get(
    "/",
    getExpenses
);


router.get(
    "/today",
    getTodayExpenses
);


router.get(
    "/monthly-analysis",
    getMonthlyAnalysis
);


router.get(
    "/date-wise",
    getDateWiseAnalysis
);


router.delete(
    "/:id",
    deleteExpense
);


module.exports = router;