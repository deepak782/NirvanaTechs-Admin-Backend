import { Router } from "express";
import multer from "multer";
import path from "path";

import {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation
} from "../controllers/quotation.controller";

import { authMiddleware } from "../middleware/auth";

const router = Router();

// — Upload PDF using multer —
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/quotations"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = file.originalname.replace(ext, "").replace(/\s+/g, "_");
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// ➤ Create quotation for specific requirement
router.post("/", authMiddleware, upload.single("pdf"), createQuotation);

// ➤ Get all quotations
router.get("/", authMiddleware, getQuotations);

// ➤ Get single quotation
router.get("/:id", authMiddleware, getQuotationById);

// ➤ Update a quotation (replace pdf optional)
router.put("/:id", authMiddleware, upload.single("pdf"), updateQuotation);

router.delete("/:id", authMiddleware, deleteQuotation);

export default router;