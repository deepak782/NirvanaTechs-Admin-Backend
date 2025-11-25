"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// GET /api/categories
const getCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.category.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return res.json({ categories });
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ message: "Error fetching categories", error });
    }
};
exports.getCategories = getCategories;
// GET /api/categories/:id
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma_1.default.category.findUnique({
            where: { id },
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.json({ category });
    }
    catch (error) {
        console.error("Error fetching category:", error);
        return res.status(500).json({ message: "Error fetching category", error });
    }
};
exports.getCategoryById = getCategoryById;
// POST /api/categories
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const existing = await prisma_1.default.category.findUnique({
            where: { name },
        });
        if (existing) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }
        const category = await prisma_1.default.category.create({
            data: {
                name,
                description,
            },
        });
        return res.json({ message: "Category created", category });
    }
    catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ message: "Error creating category", error });
    }
};
exports.createCategory = createCategory;
// PATCH /api/categories/:id
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;
        const category = await prisma_1.default.category.update({
            where: { id },
            data: {
                name,
                description,
                isActive,
            },
        });
        return res.json({ message: "Category updated", category });
    }
    catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ message: "Error updating category", error });
    }
};
exports.updateCategory = updateCategory;
// DELETE /api/categories/:id  (soft delete via isActive = false)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Soft delete: mark as inactive
        await prisma_1.default.category.update({
            where: { id },
            data: {
                isActive: false,
            },
        });
        return res.json({ message: "Category deactivated" });
    }
    catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ message: "Error deleting category", error });
    }
};
exports.deleteCategory = deleteCategory;
