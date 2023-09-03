"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const mapUser = (user) => ({
    id: user.id,
    email: user.email,
    password: user.password,
    firstName: user.first_name,
    lastName: user.last_name,
});
exports.default = {
    create: async ({ email, password, firstName, lastName, }) => {
        const { rows } = await db_1.default.query("INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *", [email, password, firstName, lastName]);
        if (rows.length === 0) {
            return null;
        }
        const user = rows[0];
        return mapUser(user);
    },
    getAll: async () => {
        const { rows } = await db_1.default.query("SELECT * FROM users");
        return rows.map(mapUser);
    },
    getById: async (id) => {
        const { rows } = await db_1.default.getByField("users", "id", id);
        if (rows.length === 0) {
            return null;
        }
        const user = rows[0];
        return mapUser(user);
    },
    getByEmail: async (email) => {
        const { rows } = await db_1.default.getByField("users", "email", email);
        if (rows.length === 0) {
            return null;
        }
        const user = rows[0];
        return mapUser(user);
    },
    makeSafe: (user) => {
        const { password, ...safeUser } = user;
        return safeUser;
    },
    updateById: async (id, { email, password, firstName, lastName, }) => {
        const { rows } = await db_1.default.queryAllowUndefined("UPDATE users SET email = COALESCE($1, email), password = COALESCE($2, password), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name) WHERE id = $5 RETURNING *", [email, password, firstName, lastName, id]);
        if (rows.length === 0) {
            return null;
        }
        const user = rows[0];
        return mapUser(user);
    },
    deleteById: async (id) => {
        const { rows } = await db_1.default.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (rows.length === 0) {
            return null;
        }
        const user = rows[0];
        return mapUser(user);
    },
};
