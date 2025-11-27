import multer from "multer";

/**
 * Memory storage → required for Cloudflare R2
 */
const storage = multer.memoryStorage();

/**
 * Validate only PDF files
 */
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"));
  }
  cb(null, true);
};

/**
 * Export Multer upload middleware
 */
export const uploadQuotationPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});