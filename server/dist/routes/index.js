"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const cart_1 = __importDefault(require("./cart"));
const products_1 = __importDefault(require("./products"));
const orders_1 = __importDefault(require("./orders"));
const users_1 = __importDefault(require("./users"));
const stripe_1 = require("../config/stripe");
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/cart", cart_1.default);
router.use("/products", products_1.default);
router.use("/orders", orders_1.default);
router.use("/users", users_1.default);
router.get("/api/health", (req, res) => {
    res.sendStatus(200);
});
router.get("/stripe-secret", async (req, res) => {
    const amount = req.query.amount;
    if (!amount || isNaN(Number(amount))) {
        res.status(400).json({ error: "Invalid amount" });
        return;
    }
    const intent = await (0, stripe_1.paymentIntent)(Number(amount));
    res.json({ clientSecret: intent.client_secret });
});
exports.default = router;
