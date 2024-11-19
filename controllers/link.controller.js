import { Link } from "../models/Link.js";
import { nanoid } from "nanoid";

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ uid: req.uid });
    return res.json({ links });
  } catch (error) {
    console;
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const getLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);
    if (!link) return res.status(404).json({ error: "Enlace no encontrado" });

    if (link.uid.toString() !== req.uid) {
      return res.status(401).json({ error: "No autorizado" });
    }

    return res.json({ link });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ error: "Formato de id incorrecto" });
    }
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const createLink = async (req, res) => {
  try {
    let { longLink } = req.body;
    if (!longLink.startsWith("http")) {
      longLink = `http://${longLink}`;
    }
    const link = new Link({ longLink, nanoLink: nanoid(6), uid: req.uid });
    await link.save();
    return res.status(201).json({ link });
  } catch (error) {
    console;
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);
    if (!link) return res.status(404).json({ error: "Enlace no encontrado" });

    if (link.uid.toString() !== req.uid) {
      return res.status(401).json({ error: "No autorizado" });
    }

    await link.deleteOne();

    return res.json({ message: "Enlace eliminado", link });
  } catch (error) {
    console.log(error);
  }
};
