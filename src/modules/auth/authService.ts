import db from "../../config/db";
import { User } from "../../interfaces/User";

export const loginUser = async (
  username: string,
  password: string
): Promise<User | null> => {
  const database = await db;
  const statement = await database.prepare(
    "SELECT * FROM users WHERE username = ? AND password = ?"
  );
  const user = (await statement.get(username, password)) as User;

  return user || null;
};
