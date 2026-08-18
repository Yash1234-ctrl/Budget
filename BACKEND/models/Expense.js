const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        note: {
            type: String,
            default: "",
            trim: true
        },

        expenseDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Expense",
    expenseSchema
);