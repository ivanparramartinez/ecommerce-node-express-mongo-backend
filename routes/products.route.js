import { Router } from "express";
import {
  getProducts,
  createBulkProducts,
} from "../controllers/products.controller.js";
import { readCsv } from "../middlewares/uploadCsv.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();

router.get("/", getProducts);
router.post(
  "/bulkProducts",
  requireAuth,
  upload.single("file"),
  readCsv,
  createBulkProducts
);

export default router;
