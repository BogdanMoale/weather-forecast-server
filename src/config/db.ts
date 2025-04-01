import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
//db config

const dbPath = path.resolve(__dirname, "../../database.sqlite");
export default open({
  filename: dbPath,
  driver: sqlite3.Database,
}).then(async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  try {
    await db.run(
      "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
      ["admin", "admin", "admin"]
    );
    await db.run(
      "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
      ["user", "user", "user"]
    );
  } catch (error) {
    console.error("Error inserting default users:", error);
  }
  return db;
});
