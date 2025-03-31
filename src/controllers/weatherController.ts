import { Request, Response } from "express";
import { getForecastData, resetForecastData } from "../services/weatherService";

export const getForecast = async (req: Request, res: Response) => {
  try {
    const { reset } = req.query;
    const userRole = req.user.privileges;

    if (reset === "true") {
      switch (userRole) {
        case "admin":
          const dataBeforeReset = await resetForecastData();
          return res.json({
            message: "Forecast data reset successfully",
            dataBeforeReset,
          });
        case "user":
          return res.status(403).json({ error: "Permission denied" });
      }
    }

    const forecastData = await getForecastData();
    res.json(forecastData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
