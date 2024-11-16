import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No se ha proporcionado un token válido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.uid) {
      throw new Error("Token no contiene uid");
    }

    req.uid = decoded.uid;
    next();
  } catch (error) {
    const TokenVerificationErrors = {
      "invalid signature": "La firma del token no es válida",
      "jwt expired": "El token ha expirado",
      "invalid token": "El token no es válido",
      "No Bearer": "El token no tiene el formato correcto",
      "Token no contiene uid":
        "El token no contiene la información de usuario necesaria",
      "jwt malformed": "El token no tiene el formato correcto",
    };

    const errorMessage =
      TokenVerificationErrors[error.message] || "Error de autenticación";

    return res.status(401).json({ error: errorMessage });
  }
};
