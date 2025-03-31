import app from "./app";
import { port } from "./config/env";
import db from "./config/db";
import { startWeatherDataFetchInterval } from "./services/weatherService";
import { fetchWeatherData } from "./services/xmlService";

async function initializeApp() {
  try {
    const database = await db;
    console.log("Database initialized ✓");

    const users = await database.all("SELECT username, password FROM users");
    console.log("Existing users:", users);

    //start server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);

      fetchWeatherData();
      startWeatherDataFetchInterval();
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

initializeApp();
