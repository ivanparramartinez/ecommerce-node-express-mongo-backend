import { Router } from "express";
import {
  getProducts,
  upsertBulkProducts, // Cambiar el nombre de la función importada
  deleteProductById,
  getProductById,
} from "../controllers/products.controller.js";
import { readAndParseXlsx } from "../middlewares/readAndParseCsv.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    if (ext !== "xlsx") {
      req.fileValidationError = "Solo se permiten archivos XLSX";
      return cb(null, false);
    }
    cb(null, true);
  },
});
const router = Router();

router.get("/", getProducts);
router.post(
  "/upsertBulkProducts", // Cambiar el nombre de la ruta
  requireAuth,
  upload.single("file"),
  readAndParseXlsx,
  upsertBulkProducts
);
router.delete("/:id", requireAuth, deleteProductById);

export default router;
