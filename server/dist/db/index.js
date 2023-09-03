"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validTables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pg_1 = require("pg");
const config_1 = require("../config");
const seedDb_1 = require("./seedDb");
exports.validTables = [
    "carts",
    "cart_items",
    "categories",
    "orders",
    "product_box_contents",
    "products",
    "similar_products",
    "users",
];
const validFields = [
    "active",
    "cart_id",
    "category_id",
    "description",
    "email",
    "features",
    "first_name",
    "id",
    "item_id",
    "last_name",
    "name",
    "new",
    "order_date",
    "password",
    "price",
    "product_id",
    "quantity",
    "similar_product_id",
    "slug",
    "status",
    "user_id",
    "phone",
    "address",
    "city",
    "postcode",
    "payment_method",
];
console.info("NODE_ENV", config_1.NODE_ENV);
const pool = new pg_1.Pool({
    connectionString: config_1.NODE_ENV === "test" ? config_1.TEST_DATABASE_URL : config_1.DATABASE_URL,
});
exports.default = {
    getClient: async () => await pool.connect(),
    query: (text, params) => pool.query(text, params),
    queryCallback: (text, callback) => pool.query(text, callback),
    queryAllowUndefined: (text, params) => pool.query(text, params),
    getByField: async (table, field, value) => {
        if (!exports.validTables.includes(table) || !validFields.includes(field)) {
            throw new Error("Invalid table or field");
        }
        const result = await pool.query(`SELECT * FROM ${table} WHERE ${field} = $1`, [value]);
        return result;
    },
    end: () => pool.end(),
    checkConnection: () => {
        console.info("Checking database connection...");
        console.info("NODE_ENV", config_1.NODE_ENV);
        console.info("SEED_DB", process.env.SEED_DB);
        return new Promise((resolve, reject) => [
            pool.query("SELECT NOW()", (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            }),
        ]);
    },
    sessionStorage: {
        pool,
        tableName: "session",
        createTableIfMissing: true,
    },
};
if (process.env.SEED_DB === "true" && config_1.NODE_ENV !== "test") {
    (0, seedDb_1.seedData)().catch(console.error);
}
