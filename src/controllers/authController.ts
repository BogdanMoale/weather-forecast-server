import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secretKey } from "../config/env";
import { loginUser } from "../services/authService";

//login
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await loginUser(username, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user.username, privileges: user.role },
      secretKey,
      { expiresIn: "1h" }
    );

    const expirationDate = getTokenExpirationDate(token);

    res.json({ token, expirationDate });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

function getTokenExpirationDate(token: string) {
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));
  const expirationTimestamp = decodedPayload.exp;

  const expirationDate = new Date(expirationTimestamp * 1000);

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return expirationDate.toLocaleString("en-US", options);
}
