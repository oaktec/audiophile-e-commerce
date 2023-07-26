import db from "../db";

interface DBUser {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  address: string;
}
interface User {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  address: string;
}

const mapUser = (user: DBUser): User => ({
  id: user.id,
  email: user.email,
  password: user.password,
  firstName: user.first_name,
  lastName: user.last_name,
  address: user.address,
});

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
  }): Promise<User | null> => {
    const { rows } = await db.query(
      "INSERT INTO users (email, password, first_name, last_name, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, password, firstName, lastName, address]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];

    return mapUser(user);
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
};
