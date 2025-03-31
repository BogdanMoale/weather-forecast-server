import axios from "axios";
import { parseStringPromise, Builder } from "xml2js";
import fs from "fs";
import path from "path";
import { city, apiKey, xmlFilePath } from "../../config/env";
import { WeatherEntry, ExistingData } from "../../types/weather";

const ensureDirectoryExists = (filePath: string) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const fetchWeatherData = async () => {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(apiUrl);

    if (response.status !== 200) {
      throw new Error("Failed to fetch weather data");
    }

    const weather = response.data;

    const timestamp = Date.now();
    const temperature = weather.main.temp;
    const itRained = weather.weather[0].main === "Rain";

    ensureDirectoryExists(xmlFilePath);

    let existingData: ExistingData = { weatherData: { entry: [] } };

    if (fs.existsSync(xmlFilePath)) {
      const xmlContent = fs.readFileSync(xmlFilePath, "utf-8");

      if (xmlContent.trim() !== "") {
        try {
          existingData = await parseStringPromise(xmlContent);
        } catch (parseError) {
          console.error("Error parsing XML:", parseError);
        }
      }
    }

    if (
      !existingData ||
      !existingData.weatherData ||
      !Array.isArray(existingData.weatherData.entry)
    ) {
      existingData = { weatherData: { entry: [] } };
    }

    // existingData.weatherData.entry.unshift({
    //   date: timestamp.toString(),
    //   weather: [
    //     { itRained: itRained.toString(), temperature: temperature.toString() },
    //   ],
    // });

    existingData.weatherData.entry.unshift({
      date: timestamp,
      weather: {
        itRained: itRained,
        temperature: temperature,
      },
    });

    //timestamp: The current timestamp (milliseconds since 1970).
    //75 * 60 * 1000: Converts 75 minutes into milliseconds (since 1 minute = 60,000 ms).
    //cutoffTime: Represents the earliest allowed timestamp for stored weather data.
    //Keep entries where entry.date >= cutoffTime (newer than 75 minutes).
    //Remove entries where entry.date < cutoffTime (older than 75 minutes).

    //delete entries older than 75 minutes
    const cutoffTime = timestamp - 75 * 60 * 1000;
    existingData.weatherData.entry = existingData.weatherData.entry.filter(
      (entry: WeatherEntry) => {
        const entryDate = parseInt(entry.date.toString());
        // console.log(`Entry date: ${entryDate}`);
        // console.log(`Cutoff time: ${cutoffTime}`);
        if (entryDate < cutoffTime) {
          console.log(`Deleting entry with date: ${entryDate}`);
          return false;
        }
        return true;
      }
    );

    //write into xml file
    const builder = new Builder();
    const xml = builder.buildObject(existingData);
    fs.writeFileSync(xmlFilePath, xml, "utf-8");

    console.log("Weather data fetched and saved successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
};
