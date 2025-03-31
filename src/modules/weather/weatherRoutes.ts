import { Router } from "express";
import { verifyToken } from "../../middleware/authMiddleware";
import { getForecast } from "./weatherController";

const router = Router();

router.get("/getForecast", verifyToken, getForecast);

export default router;
