"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const _1 = __importDefault(require("."));
const seedData = async () => {
    const client = await _1.default.getClient();
    try {
        await client.query("BEGIN");
        console.log("Dropping tables");
        await client.query(`DROP SCHEMA public CASCADE`);
        await client.query(`CREATE SCHEMA public`);
        await createTables(client);
        console.log("Seeding database");
        const dataFilePath = path.resolve(__dirname, "../data/data.json");
        const data = JSON.parse((0, fs_1.readFileSync)(dataFilePath, "utf8"));
        const categories = data.reduce((acc, curr) => {
            if (!acc.includes(curr.category)) {
                acc.push(curr.category);
            }
            return acc;
        }, []);
        for (const category of categories) {
            await client.query(`INSERT INTO categories (name) VALUES ($1)`, [
                category,
            ]);
        }
        for (const product of data) {
            const categoryId = await client.query(`SELECT id FROM categories WHERE name = $1`, [product.category]);
            await client.query(`INSERT INTO products (name, description, price, slug, category_id, new, features) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                product.name,
                product.description,
                product.price,
                product.slug,
                categoryId.rows[0].id,
                product.new,
                product.features,
            ]);
        }
        for (const product of data) {
            let productId = await client.query(`SELECT id FROM products WHERE slug = $1`, [product.slug]);
            productId = productId.rows[0].id;
            for (const similarProduct of product.others) {
                let similarProductId = await client.query(`SELECT id FROM products WHERE slug = $1`, [similarProduct]);
                similarProductId = similarProductId.rows[0]?.id;
                if (!similarProductId) {
                    console.log(`Could not find product with slug ${similarProduct} for similar products`);
                    continue;
                }
                await client.query(`INSERT INTO similar_products (product_id, similar_product_id) VALUES ($1, $2)`, [productId, similarProductId]);
            }
            for (const item of product.includes) {
                await client.query(`INSERT INTO product_box_contents (product_id, quantity, item) VALUES ($1, $2, $3)`, [productId, item.quantity, item.item]);
            }
        }
        console.info("Seeding complete");
        await client.query("COMMIT");
    }
    catch (err) {
        console.error("Error seeding database");
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
};
exports.seedData = seedData;
const createTables = async (client) => {
    await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email text NOT NULL UNIQUE,
      password text NOT NULL,
      first_name text NOT NULL,
      last_name text NOT NULL
    )`);
    await client.query(`CREATE TABLE IF NOT EXISTS categories (
   id SERIAL PRIMARY KEY,
   name text NOT NULL
 )`);
    await client.query(`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    price decimal NOT NULL,
    category_id integer NOT NULL REFERENCES categories(id),
    slug text NOT NULL,
    new boolean NOT NULL DEFAULT TRUE,
    features text NOT NULL
  )`);
    await client.query(`CREATE TABLE IF NOT EXISTS similar_products (
    product_id integer NOT NULL REFERENCES products(id),
    similar_product_id integer NOT NULL REFERENCES products(id),
    PRIMARY KEY (product_id, similar_product_id)
  )`);
    await client.query(`CREATE TABLE IF NOT EXISTS product_box_contents (
    product_id integer NOT NULL REFERENCES products(id),
    quantity integer NOT NULL,
    item text NOT NULL,
    PRIMARY KEY (product_id, item)
  )`);
    await client.query(`CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    active boolean NOT NULL DEFAULT TRUE
  )`);
    await client.query(`CREATE TABLE IF NOT EXISTS cart_items (
    cart_id integer NOT NULL REFERENCES carts(id),
    product_id integer NOT NULL REFERENCES products(id),
    quantity integer NOT NULL,
    PRIMARY KEY (cart_id, product_id)
  )`);
    await client.query(`CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    cart_id integer NOT NULL REFERENCES carts(id),
    order_date timestamp NOT NULL DEFAULT NOW(),
    status text,
    phone text,
    address text NOT NULL,
    city text NOT NULL,
    postcode text NOT NULL,
    payment_method text NOT NULL
  )`);
};
