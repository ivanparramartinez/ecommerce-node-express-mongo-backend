import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };

    user = new User({ email, password });
    await user.save();

    // JWT

    return res.status(201).json({ ok: "Usuario registrado correctamente" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    return res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const match = await user.comparePassword(password);

    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    // JWT
    const { token, expiresIn } = generateToken(user._id);

    // Token en cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
  }
};

export const infoUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean();
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json({ email: user.email });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error al obtener la información del usuario" });
  }
};
