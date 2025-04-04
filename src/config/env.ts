import dotenv from "dotenv";
//env config

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY || "",
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || "",
  CITY: process.env.CITY || "Arad",
  XML_FILE_PATH: process.env.XML_FILE_PATH || "./weatherData.xml",
  DATA_FETCH_INTERVAL: process.env.DATA_FETCH_INTERVAL_MILISEC || 60 * 1000,
};

export const port = config.PORT;
export const secretKey = config.SECRET_KEY;
export const apiKey = config.OPENWEATHER_API_KEY;
export const city = config.CITY;
export const xmlFilePath = config.XML_FILE_PATH;
export const dataFetchIntervalMilisec = config.DATA_FETCH_INTERVAL;
