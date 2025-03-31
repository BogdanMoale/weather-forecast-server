import { parseStringPromise } from "xml2js";
import fs from "fs";
import { xmlFilePath, dataFetchInterval } from "../../config/env";
import { fetchWeatherData } from "../xml/xmlService";
import { WeatherEntry, RawWeatherEntry } from "../../types/weather";

export const getForecastData = async () => {
  if (!fs.existsSync(xmlFilePath)) {
    return [];
  }

  const xmlContent = fs.readFileSync(xmlFilePath, "utf-8");
  const parsedData = await parseStringPromise(xmlContent);

  return parsedData.weatherData.entry.map((entry: RawWeatherEntry) => ({
    date: parseInt(entry.date[0]),
    weather: {
      itRained: entry.weather[0].itRained[0] === "true",
      temperature: parseFloat(entry.weather[0].temperature[0]),
    },
  }));
};

export const resetForecastData = async () => {
  let dataBeforeReset: WeatherEntry[] = [];

  //read file if exists
  if (fs.existsSync(xmlFilePath)) {
    try {
      const xmlContent = fs.readFileSync(xmlFilePath, "utf-8");
      const parsedData = await parseStringPromise(xmlContent);

      //proper structure of the data
      if (parsedData?.weatherData?.entry) {
        dataBeforeReset = parsedData.weatherData.entry.map(
          (entry: RawWeatherEntry) => ({
            date: parseInt(entry.date[0]),
            weather: {
              itRained: entry.weather[0].itRained[0] === "true",
              temperature: parseFloat(entry.weather[0].temperature[0]),
            },
          })
        );
      }

      //delete the file after reading
      fs.unlinkSync(xmlFilePath);
    } catch (error) {
      console.error("Error during reset:", error);
    }
  }

  return dataBeforeReset;
};
export const startWeatherDataFetchInterval = () => {
  setInterval(fetchWeatherData, Number(dataFetchInterval));
};
