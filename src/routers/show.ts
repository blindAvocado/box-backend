import { Router } from "express";
import * as ShowController from "../controllers/show";
import * as AuthMiddleware from "../middlewares/auth";

const router = Router();

router.get("/all", ShowController.getAllShows);
router.get("/:show_id", ShowController.getPage);
router.post("/:show_id/status", AuthMiddleware.checkAccess, ShowController.changeStatus);

export default router;
