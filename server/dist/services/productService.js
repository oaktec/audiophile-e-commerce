"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const fullMapProduct = async (product) => {
    const { rows: similarRows } = await db_1.default.query(`SELECT similar_product_id FROM similar_products WHERE product_id = $1`, [product.id]);
    const similarProductSlugs = similarRows.map(async (row) => {
        const { rows } = await db_1.default.query(`SELECT slug FROM products WHERE id = $1`, [row.similar_product_id]);
        return rows[0].slug;
    });
    const { rows } = await db_1.default.query(`SELECT item, quantity FROM product_box_contents WHERE product_id = $1`, [product.id]);
    const boxContents = rows.map((row) => ({
        item: row.item,
        quantity: row.quantity,
    }));
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.category_id,
        slug: product.slug,
        features: product.features,
        new: product.new,
        similarProducts: await Promise.all(similarProductSlugs),
        boxContents,
    };
};
const mapProduct = (product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: product.category_id,
    slug: product.slug,
    features: product.features,
    new: product.new,
});
exports.default = {
    getAll: async () => {
        const { rows } = await db_1.default.query("SELECT * FROM products");
        return rows.map(mapProduct);
    },
    getByIds: async (ids) => {
        const { rows } = await db_1.default.query(`SELECT * FROM products WHERE id = ANY ($1)`, [ids]);
        return rows.map(mapProduct);
    },
    getByCategory: async (categoryName) => {
        const { rows } = await db_1.default.query("SELECT * FROM products WHERE category_id = (SELECT id FROM categories WHERE name = $1)", [categoryName]);
        return rows.map(mapProduct);
    },
    getById: async (id) => {
        const { rows } = await db_1.default.getByField("products", "id", id);
        if (rows.length === 0) {
            return null;
        }
        const product = rows[0];
        return fullMapProduct(product);
    },
    getBySlug: async (slug) => {
        const { rows } = await db_1.default.getByField("products", "slug", slug);
        if (rows.length === 0) {
            return null;
        }
        const product = rows[0];
        return fullMapProduct(product);
    },
};
