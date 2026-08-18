const Expense = require("../models/Expense");
const Wallet = require("../models/Wallet");


// =====================================================
// ADD EXPENSE
// =====================================================

const addExpense = async (req, res) => {

    try {

        const {
            category,
            amount,
            note,
            expenseDate
        } = req.body;


        if (!category) {

            return res.status(400).json({
                message:
                    "Category is required"
            });

        }


        if (
            amount === undefined ||
            Number(amount) <= 0
        ) {

            return res.status(400).json({
                message:
                    "Enter a valid amount"
            });

        }


        const expenseAmount =
            Number(amount);


        let wallet =
            await Wallet.findOne();


        if (!wallet) {

            wallet =
                await Wallet.create({

                    name:
                        "My Wallet",

                    balance: 0

                });

        }


        if (
            wallet.balance <
            expenseAmount
        ) {

            return res.status(400).json({

                message:
                    "Insufficient wallet balance"

            });

        }


        const expense =
            await Expense.create({

                category:

                    category,

                amount:

                    expenseAmount,

                note:

                    note || "",

                expenseDate:

                    expenseDate
                        ? new Date(expenseDate)
                        : new Date()

            });


        wallet.balance -=
            expenseAmount;


        await wallet.save();


        res.status(201).json({

            message:
                "Expense added successfully",

            expense,

            wallet

        });

    } catch (error) {

        console.error(
            "Add Expense Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to add expense"

        });

    }

};


// =====================================================
// GET ALL EXPENSES
// =====================================================

const getExpenses = async (req, res) => {

    try {

        const expenses =
            await Expense.find()
                .sort({
                    expenseDate: -1
                });


        const total =
            expenses.reduce(
                (sum, expense) =>
                    sum +
                    Number(expense.amount),
                0
            );


        res.status(200).json({

            expenses,

            total

        });

    } catch (error) {

        console.error(
            "Get Expenses Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch expenses"

        });

    }

};


// =====================================================
// GET TODAY'S EXPENSES
// =====================================================

const getTodayExpenses = async (req, res) => {

    try {

        const start =
            new Date();

        start.setHours(
            0,
            0,
            0,
            0
        );


        const end =
            new Date();

        end.setHours(
            23,
            59,
            59,
            999
        );


        const expenses =
            await Expense.find({

                expenseDate: {

                    $gte: start,

                    $lte: end

                }

            }).sort({

                expenseDate: -1

            });


        const total =
            expenses.reduce(
                (sum, expense) =>
                    sum +
                    Number(expense.amount),
                0
            );


        res.status(200).json({

            expenses,

            total

        });

    } catch (error) {

        console.error(
            "Today's Expenses Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to fetch today's expenses"

        });

    }

};


// =====================================================
// MONTHLY ANALYSIS
// =====================================================

const getMonthlyAnalysis =
    async (req, res) => {

        try {

            const year =
                Number(req.query.year);

            const month =
                Number(req.query.month);


            if (
                !year ||
                !month ||
                month < 1 ||
                month > 12
            ) {

                return res.status(400).json({

                    message:
                        "Valid year and month are required"

                });

            }


            const start =
                new Date(
                    year,
                    month - 1,
                    1,
                    0,
                    0,
                    0,
                    0
                );


            const end =
                new Date(
                    year,
                    month,
                    1,
                    0,
                    0,
                    0,
                    0
                );


            const expenses =
                await Expense.find({

                    expenseDate: {

                        $gte: start,

                        $lt: end

                    }

                });


            let total = 0;


            const categoryTotals = {

                Tea: 0,

                Breakfast: 0,

                Lunch: 0,

                Dinner: 0,

                Snacks: 0,

                Travel: 0,

                Shopping: 0,

                Other: 0

            };


            expenses.forEach(
                expense => {

                    const amount =
                        Number(
                            expense.amount
                        );


                    total += amount;


                    if (
                        categoryTotals[
                        expense.category
                        ] !== undefined
                    ) {

                        categoryTotals[
                            expense.category
                        ] += amount;

                    } else {

                        categoryTotals.Other +=
                            amount;

                    }

                }
            );


            res.status(200).json({

                year,

                month,

                total,

                categoryTotals,

                expenses

            });

        } catch (error) {

            console.error(
                "Monthly Analysis Error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to calculate monthly analysis"

            });

        }

    };


// =====================================================
// DATE-WISE ANALYSIS
// =====================================================

const getDateWiseAnalysis =
    async (req, res) => {

        try {

            const year =
                Number(req.query.year);

            const month =
                Number(req.query.month);


            if (
                !year ||
                !month ||
                month < 1 ||
                month > 12
            ) {

                return res.status(400).json({

                    message:
                        "Valid year and month are required"

                });

            }


            const start =
                new Date(
                    year,
                    month - 1,
                    1,
                    0,
                    0,
                    0,
                    0
                );


            const end =
                new Date(
                    year,
                    month,
                    1,
                    0,
                    0,
                    0,
                    0
                );


            const expenses =
                await Expense.find({

                    expenseDate: {

                        $gte: start,

                        $lt: end

                    }

                }).sort({

                    expenseDate: -1

                });


            const grouped = {};


            expenses.forEach(
                expense => {

                    const date =
                        new Date(
                            expense.expenseDate
                        );


                    const dateKey =
                        date.toLocaleDateString(
                            "en-CA"
                        );


                    if (
                        !grouped[dateKey]
                    ) {

                        grouped[dateKey] = 0;

                    }


                    grouped[dateKey] +=
                        Number(
                            expense.amount
                        );

                }
            );


            const dateWise =
                Object.entries(
                    grouped
                )
                    .map(
                        ([date, total]) => ({

                            date,

                            total

                        })
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.date) -
                            new Date(a.date)
                    );


            res.status(200).json({

                year,

                month,

                dateWise

            });

        } catch (error) {

            console.error(
                "Date Wise Analysis Error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to calculate date-wise analysis"

            });

        }

    };


// =====================================================
// DELETE EXPENSE
// =====================================================

const deleteExpense =
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const expense =
                await Expense.findById(id);


            if (!expense) {

                return res.status(404).json({

                    message:
                        "Expense not found"

                });

            }


            let wallet =
                await Wallet.findOne();


            if (!wallet) {

                wallet =
                    await Wallet.create({

                        name:
                            "My Wallet",

                        balance: 0

                    });

            }


            wallet.balance +=
                Number(
                    expense.amount
                );


            await wallet.save();


            await Expense.findByIdAndDelete(
                id
            );


            res.status(200).json({

                message:
                    "Expense deleted successfully",

                wallet

            });

        } catch (error) {

            console.error(
                "Delete Expense Error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to delete expense"

            });

        }

    };


module.exports = {

    addExpense,

    getExpenses,

    getTodayExpenses,

    getMonthlyAnalysis,

    getDateWiseAnalysis,

    deleteExpense

};