"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuotation = exports.updateQuotation = exports.getQuotationById = exports.getQuotations = exports.createQuotation = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const generateRefNo_1 = require("../utils/generateRefNo");
const createQuotation = async (req, res, next) => {
    try {
        const { subject, status, leadId } = req.body;
        const file = req.file;
        const refNo = await (0, generateRefNo_1.generateRefNo)();
        const quotation = await prisma_1.default.quotation.create({
            data: {
                refNo,
                subject,
                status: (status || 'DRAFT'),
                pdfUrl: file ? `/uploads/quotations/${file.filename}` : undefined,
                leadId,
            },
            include: { lead: true },
        });
        res.status(201).json({ success: true, quotation });
    }
    catch (err) {
        next(err);
    }
};
exports.createQuotation = createQuotation;
const getQuotations = async (req, res, next) => {
    try {
        const quotations = await prisma_1.default.quotation.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                lead: {
                    select: {
                        id: true,
                        name: true,
                        mobile: true,
                        technology: true,
                    },
                },
            },
        });
        res.json({ success: true, quotations });
    }
    catch (err) {
        next(err);
    }
};
exports.getQuotations = getQuotations;
const getQuotationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const quotation = await prisma_1.default.quotation.findUnique({
            where: { id },
            include: { lead: true },
        });
        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }
        res.json({ success: true, quotation });
    }
    catch (err) {
        next(err);
    }
};
exports.getQuotationById = getQuotationById;
const updateQuotation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { subject, status, leadId } = req.body;
        const file = req.file;
        const quotation = await prisma_1.default.quotation.update({
            where: { id },
            data: {
                subject,
                status: status,
                leadId,
                pdfUrl: file ? `/uploads/quotations/${file.filename}` : undefined,
            },
            include: { lead: true },
        });
        res.json({ success: true, quotation });
    }
    catch (err) {
        next(err);
    }
};
exports.updateQuotation = updateQuotation;
const deleteQuotation = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.default.quotation.delete({ where: { id } });
        res.json({ success: true, message: "Quotation deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteQuotation = deleteQuotation;
