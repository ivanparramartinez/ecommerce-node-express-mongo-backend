import axios from "axios";
import { validationResult, body, param } from "express-validator";

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const paramsLinkValidator = [
  param("id", "Formato no valido").trim().notEmpty().escape(),
  validationResultExpress,
];

export const bodyLinkValidator = [
  body("longLink", "El enlace no es válido")
    .trim()
    .notEmpty()
    .withMessage("El enlace no puede estar vacío")
    .bail()
    .isURL()
    .withMessage("El enlace no es una URL válida")
    .bail()
    .custom(async (value) => {
      try {
        if (!value.startsWith("http")) {
          value = `http://${value}`;
        }
        await axios.get(value);
        return value;
      } catch (error) {
        console.log(error);
        throw new Error("El enlace no es válido axios");
      }
    }),
  validationResultExpress,
];

export const bodyRegisterValidator = [
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
  validationResultExpress,
];

export const bodyLoginValidator = [
  body("email", "Formato de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
  validationResultExpress,
];
