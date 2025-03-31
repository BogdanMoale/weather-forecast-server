import { Router } from "express";
import { home } from "../controllers/homeControler";

const router = Router();

router.get("/", home);

export default router;
