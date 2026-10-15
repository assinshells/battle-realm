import { Router } from "express";
import { WorldController } from "../controllers/world.controller.js";
import { authGuard } from "../guards/auth.guard.js";

const router = Router();

router.get("/map", authGuard, WorldController.map);
router.get("/cities/:cityId", authGuard, WorldController.city);
router.get("/locations/:locationId", authGuard, WorldController.location);

export default router;
