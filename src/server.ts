import express, { Request, Response, NextFunction } from "express";

import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import axios from "axios";
import db from "./db";
import dotenv from "dotenv";
import fs from "fs";
import { parseStringPromise, Builder } from "xml2js";

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
const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY || "default_secret_key";
const apiKey = process.env.OPENWEATHER_API_KEY || "";
const city = process.env.CITY || "Arad";
const xmlFilePath = process.env.XML_FILE_PATH || "database/weather.xml";

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send(
    "Welcome to the Weather Forecast Server! 🌤️ Use /login to authenticate and /getForecast to fetch data."
  );
});

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

async function fetchWeatherData() {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(apiUrl);
    const weather = response.data;

    const timestamp = Date.now();
    const temperature = weather.main.temp;
    const itRained = weather.weather[0].main === "Rain";

    let existingData: any = { weatherData: { entry: [] } };

    if (fs.existsSync(xmlFilePath)) {
      const xmlContent = fs.readFileSync(xmlFilePath, "utf-8");
      const parsedData = await parseStringPromise(xmlContent);

      if (
        parsedData &&
        parsedData.weatherData &&
        Array.isArray(parsedData.weatherData.entry)
      ) {
        existingData = parsedData;
      }
    }

    existingData.weatherData.entry.unshift({
      date: timestamp,
      weather: [{ itRained: itRained, temperature: temperature }],
    });

    const cutoffTime = timestamp - 75 * 60 * 1000;
    existingData.weatherData.entry = existingData.weatherData.entry.filter(
      (entry: any) => parseInt(entry.date) >= cutoffTime
    );

    const builder = new Builder();
    const xml = builder.buildObject(existingData);
    fs.writeFileSync(xmlFilePath, xml);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

app.get("/getForecast", verifyToken, async (req: Request, res: Response) => {
  const { reset } = req.query;
  const userRole = req.user.privileges;

  if (!fs.existsSync(xmlFilePath)) {
    return res.json([]);
  }

  const xmlContent = fs.readFileSync(xmlFilePath, "utf-8");
  const parsedData = await parseStringPromise(xmlContent);

  const forecastData = parsedData.weatherData.entry.map((entry: any) => ({
    date: parseInt(entry.date[0]),
    weather: {
      itRained: entry.weather[0].itRained[0] === "true",
      temperature: parseFloat(entry.weather[0].temperature[0]),
    },
  }));

  if (reset === "true" && userRole === "admin") {
    fs.unlinkSync(xmlFilePath);
  }

  res.json(forecastData);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  setInterval(fetchWeatherData, 60 * 10);
});
