"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const quotation_controller_1 = require("../controllers/quotation.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// — Upload PDF using multer —
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../../uploads/quotations"));
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const base = file.originalname.replace(ext, "").replace(/\s+/g, "_");
        cb(null, `${base}_${Date.now()}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// ➤ Create quotation for specific requirement
router.post("/", auth_1.authMiddleware, upload.single("pdf"), quotation_controller_1.createQuotation);
// ➤ Get all quotations
router.get("/", auth_1.authMiddleware, quotation_controller_1.getQuotations);
// ➤ Get single quotation
router.get("/:id", auth_1.authMiddleware, quotation_controller_1.getQuotationById);
// ➤ Update a quotation (replace pdf optional)
router.put("/:id", auth_1.authMiddleware, upload.single("pdf"), quotation_controller_1.updateQuotation);
router.delete("/:id", auth_1.authMiddleware, quotation_controller_1.deleteQuotation);
exports.default = router;
