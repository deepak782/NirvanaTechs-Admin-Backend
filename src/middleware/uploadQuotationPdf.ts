import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import type { Request } from "express";

/**
 * FIX 1: Use path.resolve() → works in both local & Render
 */
const uploadDir = path.resolve("uploads/quotations");

/**
 * FIX 2: Ensure folder exists (safe for Render)
 */
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * FIX 3: Explicit typing for multer callbacks → removes TS7006 errors
 */
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDir);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || ".pdf";

    // safer name (remove illegal chars)
    const safeName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    cb(null, `quotation-${timestamp}${ext}`);
  },
});

/**
 * FIX 4: Properly typed multer export
 */
export const uploadQuotationPdf = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});