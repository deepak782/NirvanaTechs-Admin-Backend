import { Router } from "express";
import { uploadQuotationPdf } from "../middleware/uploadQuotationPdf";
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation
} from "../controllers/quotation.controller";

import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * Upload using memoryStorage (R2 compatible)
 * Field name must match frontend: "file"
 */
router.post(
  "/",
  authMiddleware,
  uploadQuotationPdf.single("pdf"),
  createQuotation
);

router.get("/", authMiddleware, getQuotations);

router.get("/:id", authMiddleware, getQuotationById);

router.put(
  "/:id",
  authMiddleware,
  uploadQuotationPdf.single("pdf"),
  updateQuotation
);

router.delete("/:id", authMiddleware, deleteQuotation);

export default router;