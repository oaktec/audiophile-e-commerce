"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
});
const paymentIntent = async (amount) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "gbp",
    });
    return paymentIntent;
};
exports.paymentIntent = paymentIntent;
