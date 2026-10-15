import { Router } from "express";
import { WorkController } from "../controllers/work.controller.js";
import { authGuard } from "../guards/auth.guard.js";

const router = Router();

router.get("/", authGuard, WorkController.state);
router.post("/start", authGuard, WorkController.start);
router.post("/cancel", authGuard, WorkController.cancel);

export default router;
