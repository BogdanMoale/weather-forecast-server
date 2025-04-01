import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import homeRoutes from "./routes/homeRoutes";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(bodyParser.json());
app.use("/home", homeRoutes);
app.use("/getForecast", weatherRoutes);
app.use("/login", authRoutes);

app.use(errorHandler);

export default app;
