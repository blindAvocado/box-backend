import { Router } from "express";
import * as EpisodeController from "../controllers/episode";
import * as AuthMiddleware from "../middlewares/auth";

const router = Router();

router.get("/:episode_id", AuthMiddleware.getUser, EpisodeController.getPage);
router.get("/:episode_id/comments", EpisodeController.getEpisodeComments);
router.post("/:episode_id/comment", AuthMiddleware.checkAccess, EpisodeController.createEpisodeComment);
// router.delete("/:episode_id/comment/:comment_id", AuthMiddleware.checkAccess, EpisodeController.b);

export default router;
