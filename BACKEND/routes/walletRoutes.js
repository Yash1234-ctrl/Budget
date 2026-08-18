const express = require("express");

const {
    getWallet,
    createWallet,
    addMoney,
    resetWallet
} = require("../controllers/walletController");

const router = express.Router();


router.get(
    "/",
    getWallet
);


router.post(
    "/",
    createWallet
);


router.post(
    "/add-money",
    addMoney
);


router.post(
    "/reset",
    resetWallet
);


module.exports = router;