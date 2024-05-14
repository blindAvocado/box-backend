import { Router } from "express";
import * as AdminController from "../controllers/admin";

const router = Router();

router.post("/show/tmdb/:tmdb", AdminController.addShowFromTMDB);

export default router;
