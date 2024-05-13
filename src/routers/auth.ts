import { Router } from "express";
import * as AuthController from "../controllers/auth";
import * as AuthMiddleware from "../middlewares/auth";
// import AuthValidator from "../validators/Auth.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.post("/logout", AuthMiddleware.checkAccess, AuthController.logout);
router.post("/refresh", AuthMiddleware.checkAccess, AuthController.refresh);

export default router;