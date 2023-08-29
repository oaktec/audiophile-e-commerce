import db from "../db";

interface DBUser {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
interface User {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
}

const mapUser = (user: DBUser): User => ({
  id: user.id,
  email: user.email,
  password: user.password,
  firstName: user.first_name,
  lastName: user.last_name,
});

export default {
  create: async ({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
  }): Promise<User | null> => {
    const { rows } = await db.query(
      "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, password, firstName, lastName]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return mapUser(user);
  },
  getAll: async (): Promise<User[]> => {
    const { rows } = await db.query("SELECT * FROM users");

    return rows.map(mapUser);
  },
  getById: async (id: number): Promise<User | null> => {
    const { rows } = await db.getByField("users", "id", id);

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return mapUser(user);
  },
  getByEmail: async (email: string): Promise<User | null> => {
    const { rows } = await db.getByField("users", "email", email);

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return mapUser(user);
  },
  makeSafe: (user: User): User => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return safeUser;
  },
  updateById: async (
    id: number,
    {
      email,
      password,
      firstName,
      lastName,
    }: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
    }
  ): Promise<User | null> => {
    const { rows } = await db.queryAllowUndefined(
      "UPDATE users SET email = COALESCE($1, email), password = COALESCE($2, password), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name) WHERE id = $5 RETURNING *",
      [email, password, firstName, lastName, id]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return mapUser(user);
  },
  deleteById: async (id: number): Promise<User | null> => {
    const { rows } = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return mapUser(user);
  },
};
