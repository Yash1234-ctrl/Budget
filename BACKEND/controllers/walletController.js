const Wallet = require("../models/Wallet");


// =====================================================
// GET WALLET
// =====================================================

const getWallet = async (req, res) => {

    try {

        let wallet = await Wallet.findOne();

        if (!wallet) {

            wallet = await Wallet.create({
                name: "My Wallet",
                balance: 0
            });

        }

        res.status(200).json(wallet);

    } catch (error) {

        console.error(
            "Get Wallet Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch wallet"
        });

    }

};


// =====================================================
// CREATE WALLET
// =====================================================

const createWallet = async (req, res) => {

    try {

        const {
            name,
            balance
        } = req.body;


        if (
            balance === undefined ||
            Number(balance) < 0
        ) {

            return res.status(400).json({
                message:
                    "Balance must be 0 or greater"
            });

        }


        const existingWallet =
            await Wallet.findOne();


        if (existingWallet) {

            return res.status(400).json({
                message:
                    "Wallet already exists"
            });

        }


        const wallet =
            await Wallet.create({

                name:
                    name ||
                    "My Wallet",

                balance:
                    Number(balance)

            });


        res.status(201).json(wallet);

    } catch (error) {

        console.error(
            "Create Wallet Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create wallet"
        });

    }

};


// =====================================================
// ADD MONEY
// =====================================================

const addMoney = async (req, res) => {

    try {

        const {
            amount
        } = req.body;


        if (
            !amount ||
            Number(amount) <= 0
        ) {

            return res.status(400).json({
                message:
                    "Enter a valid amount"
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
            Number(amount);


        await wallet.save();


        res.status(200).json({

            message:
                "Money added successfully",

            wallet

        });

    } catch (error) {

        console.error(
            "Add Money Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to add money"
        });

    }

};


// =====================================================
// RESET WALLET
// =====================================================

const resetWallet = async (req, res) => {

    try {

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


        wallet.balance = 0;


        await wallet.save();


        res.status(200).json({

            message:
                "Wallet reset successfully",

            wallet

        });

    } catch (error) {

        console.error(
            "Reset Wallet Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to reset wallet"

        });

    }

};


module.exports = {

    getWallet,

    createWallet,

    addMoney,

    resetWallet

};