import { Router } from "express";
import {
  infoUser,
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validationResultExpress } from "../middlewares/validationResultExpress.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
const router = Router();

router.post(
  "/register",
  [
    body("email", "Formato de email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
    body("password", "La contraseña debe tener al menos 6 caracteres").custom(
      (value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        } else {
          return value;
        }
      }
    ),
  ],
  validationResultExpress,
  register
);

router.post(
  "/login",
  [
    body("email", "Formato de email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
  ],
  validationResultExpress,
  login
);

router.get("/protected", requireAuth, infoUser);
router.get("/refresh", requireRefreshToken, refreshToken);
router.get("/logout", logout);

export default router;
