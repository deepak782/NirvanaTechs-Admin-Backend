"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadQuotationPdf = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * FIX 1: Use path.resolve() → works in both local & Render
 */
const uploadDir = path_1.default.resolve("uploads/quotations");
/**
 * FIX 2: Ensure folder exists (safe for Render)
 */
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
/**
 * FIX 3: Explicit typing for multer callbacks → removes TS7006 errors
 */
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path_1.default.extname(file.originalname) || ".pdf";
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
exports.uploadQuotationPdf = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});
