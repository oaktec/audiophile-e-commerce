"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const http_status_codes_1 = require("http-status-codes");
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
exports.default = {
    createCartForUser: async (req, res, next) => {
        const userId = req.user?.id;
        if (!userId) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You must be logged in to do that"));
        }
        let cart = await services_1.cartService.getActiveCartByUserId(userId);
        if (cart) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "You already have an active cart"));
        }
        cart = await services_1.cartService.create(userId);
        if (!cart) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create cart"));
        }
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            id: cart.id,
        });
    },
    checkoutCart: [
        middlewares_1.validationMiddleware,
        async (req, res, next) => {
            const cartId = req.cart?.id;
            if (!cartId) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to checkout"));
            }
            const userId = req.user?.id;
            if (!userId) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You must be logged in to do that"));
            }
            const { address, postcode, city, phone, paymentMethod, paymentParams } = req.body;
            await services_1.cartService.checkout(userId, cartId, address, postcode, city, paymentMethod, paymentParams, phone);
            res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
        },
    ],
    getActiveCart: async (req, res, next) => {
        const cart = req.cart;
        if (!cart) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get active cart"));
        }
        const cartItemIds = await services_1.cartService.getProducts(cart.id);
        const cartProducts = await services_1.productService.getByIds(cartItemIds.map((item) => item.product_id));
        const cartProductRet = cartProducts.map((product) => ({
            name: product.name,
            id: product.id,
            price: Number(product.price),
            slug: product.slug,
            quantity: cartItemIds.find((item) => item.product_id === product.id)
                ?.quantity,
        }));
        return res.json({
            id: cart.id,
            userId: cart.userId,
            active: cart.active,
            items: cartProductRet,
        });
    },
    addToCart: [
        middlewares_1.validationMiddleware,
        async (req, res, next) => {
            const cartId = req.cart?.id;
            const productId = Number(req.params.productId);
            const quantity = Number(req.body?.quantity);
            if (!cartId) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add product to cart"));
            }
            if (!productId) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product ID is required"));
            }
            const product = await services_1.productService.getById(productId);
            if (!product) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product not found"));
            }
            const cartProduct = await services_1.cartService.addProductToCart(cartId, productId, quantity);
            if (!cartProduct) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add product to cart"));
            }
            res.json(cartProduct);
        },
    ],
    updateCartProduct: [
        middlewares_1.validationMiddleware,
        async (req, res, next) => {
            const cartId = req.cart?.id;
            const productId = Number(req.params.productId);
            const quantity = Number(req.body?.quantity);
            if (!cartId) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update cart product"));
            }
            if (!productId) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product ID is required"));
            }
            const product = await services_1.productService.getById(productId);
            if (!product) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product not found"));
            }
            await services_1.cartService.updateCartProductQuantity(cartId, productId, quantity);
            const cart = req.cart;
            if (!cart) {
                return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get active cart"));
            }
            const cartItemIds = await services_1.cartService.getProducts(cart.id);
            const cartProducts = await services_1.productService.getByIds(cartItemIds.map((item) => item.product_id));
            const cartProductRet = cartProducts.map((product) => ({
                name: product.name,
                id: product.id,
                price: Number(product.price),
                slug: product.slug,
                quantity: cartItemIds.find((item) => item.product_id === product.id)
                    ?.quantity,
            }));
            return res.json({
                id: cart.id,
                userId: cart.userId,
                active: cart.active,
                items: cartProductRet,
            });
        },
    ],
    removeFromCart: async (req, res, next) => {
        const cartId = req.cart?.id;
        const productId = Number(req.params.productId);
        if (!cartId) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to remove product from cart"));
        }
        if (!productId) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product ID is required"));
        }
        const product = await services_1.productService.getById(productId);
        if (!product) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Product not found"));
        }
        await services_1.cartService.removeProductFromCart(cartId, productId);
        const cart = req.cart;
        if (!cart) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get active cart"));
        }
        const cartItemIds = await services_1.cartService.getProducts(cart.id);
        const cartProducts = await services_1.productService.getByIds(cartItemIds.map((item) => item.product_id));
        const cartProductRet = cartProducts.map((product) => ({
            name: product.name,
            id: product.id,
            price: Number(product.price),
            slug: product.slug,
            quantity: cartItemIds.find((item) => item.product_id === product.id)
                ?.quantity,
        }));
        return res.json({
            id: cart.id,
            userId: cart.userId,
            active: cart.active,
            items: cartProductRet,
        });
    },
    deleteActiveCart: async (req, res, next) => {
        const cartId = req.cart?.id;
        if (!cartId) {
            return next((0, http_errors_1.default)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete cart"));
        }
        await services_1.cartService.delete(cartId);
        res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
    },
};
