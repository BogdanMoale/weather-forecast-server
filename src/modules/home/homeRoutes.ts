import { Router } from "express";
import { home } from "./homeControler";

const router = Router();

router.get("/", home);

export default router;
