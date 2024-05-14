import { Router } from "express";
import * as UserController from "../controllers/user";
import * as AuthMiddleware from "../middlewares/auth";

const router = Router();

// router.get("/:user_id", UserController.getPage);
// router.get("/:user_id/watched_shows", UserController.getWatchedShows);
router.post("/rate", AuthMiddleware.checkAccess, UserController.rate);
router.post("/like", AuthMiddleware.checkAccess, UserController.like);
router.post("/watch", AuthMiddleware.checkAccess, UserController.watch);

export default router;
