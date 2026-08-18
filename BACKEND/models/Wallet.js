const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "My Wallet",
            trim: true
        },

        balance: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Wallet",
    walletSchema
);