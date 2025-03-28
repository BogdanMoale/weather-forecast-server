import express, { Request, Response, NextFunction } from "express";

import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

import db from "./db";
import dotenv from "dotenv";

dotenv.config();

interface User {
  username: string;
  password: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
const secretKey = process.env.SECRET_KEY || "default_secret_key";

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send(
    "Welcome to the Weather Forecast Server! 🌤️ Use /login to authenticate and /getForecast to fetch data."
  );
});

// Login Route
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = db
    .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
    .get(username, password) as User;

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: user.username, privileges: user.role },
    secretKey,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// Middleware to Verify Token
function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Token not provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}
