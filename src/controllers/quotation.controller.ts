// src/controllers/quotation.controller.ts

import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import { QuotationStatus } from "@prisma/client";
import { generateRefNo } from "../utils/generateRefNo";
import { uploadPDFToR2, deleteFromR2 } from "../utils/uploadR2";

/* -------------------------------------------------------
   CREATE QUOTATION
--------------------------------------------------------- */
export const createQuotation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subject, status, leadId } = req.body;
    const file = req.file;

    const refNo = await generateRefNo();

    let pdfUrl: string | undefined = undefined;

    // Upload to R2 if a file is sent
    if (file) {
      pdfUrl = await uploadPDFToR2(file);
    }

    const quotation = await prisma.quotation.create({
      data: {
        refNo,
        subject,
        status: (status || "DRAFT") as QuotationStatus,
        pdfUrl,
        leadId,
      },
      include: { lead: true },
    });

    res.status(201).json({ success: true, quotation });
  } catch (err) {
    next(err);
  }
};

/* -------------------------------------------------------
   GET ALL QUOTATIONS
--------------------------------------------------------- */
export const getQuotations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: "desc" },
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

/* -------------------------------------------------------
   GET SINGLE QUOTATION
--------------------------------------------------------- */
export const getQuotationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }

    res.json({ success: true, quotation });
  } catch (err) {
    next(err);
  }
};

/* -------------------------------------------------------
   UPDATE QUOTATION (R2 Compatible)
--------------------------------------------------------- */
export const updateQuotation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { subject, status, leadId } = req.body;
    const file = req.file;

    const existing = await prisma.quotation.findUnique({
      where: { id },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }

    let pdfUrl = existing.pdfUrl;

    // If a new PDF is uploaded → delete old + upload new
    if (file) {
      if (existing.pdfUrl) {
        await deleteFromR2(existing.pdfUrl);
      }
      pdfUrl = await uploadPDFToR2(file);
    }

    const quotation = await prisma.quotation.update({
      where: { id },
      data: {
        subject,
        status: status as QuotationStatus,
        leadId,
        pdfUrl,
      },
      include: { lead: true },
    });

    res.json({ success: true, quotation });
  } catch (err) {
    next(err);
  }
};

/* -------------------------------------------------------
   DELETE QUOTATION (Delete PDF from R2)
--------------------------------------------------------- */
export const deleteQuotation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
    });

    if (!quotation) {
      return res
        .status(404)
        .json({ success: false, message: "Quotation not found" });
    }

    // Delete PDF from R2
    if (quotation.pdfUrl) {
      await deleteFromR2(quotation.pdfUrl);
    }

    // Delete DB record
    await prisma.quotation.delete({ where: { id } });

    res.json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};