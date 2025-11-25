"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendQuotationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const sendQuotationEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const quotation = await prisma_1.default.quotation.findUnique({
            where: { id },
            include: { client: true },
        });
        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: "Quotation not found",
            });
        }
        if (!email && !quotation.client?.email) {
            return res.status(400).json({
                success: false,
                message: "No email provided and client has no email saved",
            });
        }
        const pdfAbsolutePath = path_1.default.join(__dirname, "..", "..", quotation.pdfPath.startsWith("/")
            ? quotation.pdfPath.slice(1)
            : quotation.pdfPath);
        if (!fs_1.default.existsSync(pdfAbsolutePath)) {
            return res.status(404).json({
                success: false,
                message: "Quotation PDF file not found on server",
            });
        }
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: `"Nirvana Techs" <${process.env.EMAIL_USER}>`,
            to: email || quotation.client?.email,
            subject: "Project Quotation from Nirvana Techs",
            text: "Please find the attached project quotation PDF.",
            attachments: [
                {
                    filename: quotation.refNo || "quotation.pdf",
                    path: pdfAbsolutePath,
                },
            ],
        });
        res.json({
            success: true,
            message: "Quotation email sent successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to send quotation email",
        });
    }
};
exports.sendQuotationEmail = sendQuotationEmail;
