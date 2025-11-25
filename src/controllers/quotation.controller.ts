import { Request, Response, NextFunction } from 'express';
import prisma from  "../utils/prisma";
import { QuotationStatus } from '@prisma/client';
import { generateRefNo } from '../utils/generateRefNo';

export const createQuotation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, status, leadId } = req.body;
    const file = req.file;

    const refNo = await generateRefNo();

    const quotation = await prisma.quotation.create({
      data: {
        refNo,
        subject,
        status: (status || 'DRAFT') as QuotationStatus,
        pdfUrl: file ? `/uploads/quotations/${file.filename}` : undefined,
        leadId,
      },
      include: { lead: true },
    });

    res.status(201).json({ success: true, quotation });
  } catch (err) {
    next(err);
  }
};

export const getQuotations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quotations = await prisma.quotation.findMany({
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
  } catch (err) {
    next(err);
  }
};

export const getQuotationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    res.json({ success: true, quotation });
  } catch (err) {
    next(err);
  }
};

export const updateQuotation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { subject, status, leadId } = req.body;
    const file = req.file;

    const quotation = await prisma.quotation.update({
      where: { id },
      data: {
        subject,
        status: status as QuotationStatus,
        leadId,
        pdfUrl: file ? `/uploads/quotations/${file.filename}` : undefined,
      },
      include: { lead: true },
    });

    res.json({ success: true, quotation });
  } catch (err) {
    next(err);
  }
};

export const deleteQuotation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.quotation.delete({ where: { id } });
    res.json({ success: true, message: "Quotation deleted successfully" });
  } catch (err) {
    next(err);
  }
};