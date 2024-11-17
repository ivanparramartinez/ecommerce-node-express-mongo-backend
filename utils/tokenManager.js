import jwt from "jsonwebtoken";
export const generateToken = (uid) => {
  const expiresIn = 60 * 15;
  try {
    const token = jwt.sign({ uid }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });

    return { token, expiresIn };
  } catch (error) {
    console.log(error);
  }
};

export const generateRefreshToken = (uid, res) => {
  const expiresIn = 60 * 60 * 24 * 30;
  try {
    const refreshToken = jwt.sign({ uid }, process.env.JWT_REFRESH, {
      expiresIn: expiresIn,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + expiresIn * 1000),
    });

    return { refreshToken, expiresIn };
  } catch (error) {
    console.log(error);
  }
};

export const tokenVerificationErrors = {
  "invalid signature": "La firma del token no es válida",
  "jwt expired": "El token ha expirado",
  "invalid token": "El token no es válido",
  "No Bearer": "El token no tiene el formato correcto",
  "Token no contiene uid":
    "El token no contiene la información de usuario necesaria",
  "jwt malformed": "El token no tiene el formato correcto",
};
