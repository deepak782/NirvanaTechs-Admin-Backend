"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All category routes require auth (admin panel)
router.get("/", auth_1.authMiddleware, category_controller_1.getCategories);
router.get("/:id", auth_1.authMiddleware, category_controller_1.getCategoryById);
router.post("/", auth_1.authMiddleware, category_controller_1.createCategory);
router.patch("/:id", auth_1.authMiddleware, category_controller_1.updateCategory);
router.delete("/:id", auth_1.authMiddleware, category_controller_1.deleteCategory);
exports.default = router;
