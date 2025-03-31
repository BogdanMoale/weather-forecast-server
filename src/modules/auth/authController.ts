import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secretKey } from "../../config/env";
import { loginUser } from "./authService";

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

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
