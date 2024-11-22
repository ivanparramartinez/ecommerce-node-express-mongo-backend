import { Router } from "express";
import {
  getProducts,
  createBulkProducts,
} from "../controllers/products.controller.js";
import { readAndParseCsv } from "../middlewares/readAndParseCsv.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    if (ext !== "csv") {
      req.fileValidationError = "Solo se permiten archivos csv";
      return cb(null, false);
    }
    cb(null, true);
  },
});
const router = Router();

router.get("/", getProducts);
router.post(
  "/bulkProducts",
  requireAuth,
  upload.single("file"),
  readAndParseCsv,
  createBulkProducts
);

export default router;
