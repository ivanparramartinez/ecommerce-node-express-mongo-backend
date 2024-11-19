import { Router } from "express";
import {
  createLink,
  deleteLink,
  getLink,
  getLinks,
} from "../controllers/link.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { bodyLinkValidator } from "../middlewares/validatorManager.js";

const router = Router();

// GET /api/v1/links - Get all links
router.get("/", requireAuth, getLinks);

// GET /api/v1/links/:id - Get link by id
router.get("/:id", requireAuth, getLink);

// POST /api/v1/links - Create a new link
router.post("/", requireAuth, bodyLinkValidator, createLink);

// PATCH /api/v1/links/:id - Update link by id
router.patch("/:id", (req, res) => {
  res.send("Update link by id");
});

// DELETE /api/v1/links/:id - Delete link by id
router.delete("/:id", requireAuth, deleteLink);

export default router;
