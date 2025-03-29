import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const db = new Database("database/database.sqlite", { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK( role IN ('admin', 'user') ) NOT NULL
  )
`);

const hashPassword = (password: string) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

// Insert admin and user if they don't exist
const insertUser = db.prepare(
  "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)"
);
insertUser.run("admin", hashPassword("admin"), "admin");
insertUser.run("user", hashPassword("user"), "user");

export default db;
