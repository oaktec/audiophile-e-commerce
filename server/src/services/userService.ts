import db from "../db";

export default {
  // create user, if successful, return user
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
  getByEmail: async (email: string) => {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    return rows;
  },
};
