import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import homeRoutes from "./routes/homeRoutes";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(bodyParser.json());
app.use("/", homeRoutes);
app.use("/", weatherRoutes);
app.use("/", authRoutes);

app.use(errorHandler);

export default app;
