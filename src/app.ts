import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./modules/auth/authRoutes";
import weatherRoutes from "./modules/weather/weatherRoutes";
import homeRoutes from "./modules/home/homeRoutes";
import { startWeatherDataFetchInterval } from "./modules/weather/weatherService";

const app = express();

app.use(bodyParser.json());
app.use("/", homeRoutes);
app.use("/", weatherRoutes);
app.use("/", authRoutes);

// startWeatherDataFetchInterval();

export default app;
