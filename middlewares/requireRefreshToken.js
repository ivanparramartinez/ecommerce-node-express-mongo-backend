import jwt from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/tokenManager.js";

export const requireRefreshToken = (req, res, next) => {
  try {
    const refToken = req.cookies.refreshToken;
    if (!refToken)
      throw new Error("No se ha proporcionado un token de refresh válido");

    const { uid } = jwt.verify(refToken, process.env.JWT_REFRESH);

    req.uid = uid;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: tokenVerificationErrors[error.message] || "Error de autenticación",
    });
  }
};
