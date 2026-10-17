import { Router } from "express";
import { MissionController } from "../controllers/mission.controller.js";
import { authGuard } from "../guards/auth.guard.js";

const router = Router();

// Авторизация по заголовку Authorization (не по cookie) — CSRF не применим.
router.get("/state", authGuard, MissionController.state);
router.post("/start", authGuard, MissionController.start);

export default router;
