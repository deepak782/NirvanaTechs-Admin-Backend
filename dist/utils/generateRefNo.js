"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefNo = generateRefNo;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function generateRefNo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    // Find last quotation for this year+month
    const prefix = `NT/QUO/${year}/${month}-`;
    const lastQuotation = await prisma.quotation.findFirst({
        where: { refNo: { startsWith: prefix } },
        orderBy: { refNo: 'desc' },
    });
    let nextNumber = 1;
    if (lastQuotation?.refNo) {
        const parts = lastQuotation.refNo.split('-');
        const lastNum = Number(parts[1]);
        if (!Number.isNaN(lastNum)) {
            nextNumber = lastNum + 1;
        }
    }
    const counter = String(nextNumber).padStart(3, '0');
    return `${prefix}${counter}`;
}
