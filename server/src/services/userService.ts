import db from "../db";

export default {
  create: async ({
    email,
    password,
    firstName,
    lastName,
    address,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
  }) => {
    const result = await db.query(
      "INSERT INTO users (email, password, first_name, last_name, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, password, firstName, lastName, address]
    );

    return result.rows[0];
  },
  getById: async (id: number) => {
    const { rows } = await db.getByField("users", "id", id);

    return rows;
  },
  getByEmail: async (email: string) => {
    const { rows } = await db.getByField("users", "email", email);

    return rows;
  },
};
