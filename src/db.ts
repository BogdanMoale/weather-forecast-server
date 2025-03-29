import Database from "better-sqlite3";

const db = new Database("database/database.sqlite", { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK( role IN ('admin', 'user') ) NOT NULL
  )
`);

//inster admin and user if not exists
const insertUser = db.prepare(
  "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)"
);
insertUser.run("admin", "admin", "admin");
insertUser.run("user", "user", "user");

export default db;
