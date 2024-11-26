import jwt from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/tokenManager.js";

export const requireAuth = (req, res, next) => {
  console.log("require auth");
  try {
    let token = req.headers?.authorization;

    if (!token) throw new Error("No Bearer");

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.uid) {
      throw new Error("Token no contiene uid");
    }

    req.uid = decoded.uid;
    next();
  } catch (error) {
    const errorMessage =
      tokenVerificationErrors[error.message] || "Error de autenticación";

    return res.status(401).json({ error: errorMessage });
  }
};

export const requireAuthWithCookies = (req, res, next) => {
  // this works with cookies
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ error: "No se ha proporcionado un token válido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.uid) {
      throw new Error("Token no contiene uid");
    }

    req.uid = decoded.uid;
    next();
  } catch (error) {
    const errorMessage =
      tokenVerificationErrors[error.message] || "Error de autenticación";

    return res.status(401).json({ error: errorMessage });
  }
};
