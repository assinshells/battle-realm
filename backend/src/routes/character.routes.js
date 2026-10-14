import { Router } from "express";
import { CharacterController } from "../controllers/character.controller.js";
import { authGuard } from "../guards/auth.guard.js";

const router = Router();

// Авторизация — по заголовку Authorization (не по cookie), поэтому CSRF
// здесь не применим, в отличие от /refresh и /logout.
router.post(
  "/attributes/upgrade",
  authGuard,
  CharacterController.upgradeAttribute,
);

export default router;
