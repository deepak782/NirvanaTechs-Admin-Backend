import { Request, Response } from "express";
import { PrismaClient, PaymentMethod, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Map DB model → UI format expected by Lovable
 */
const mapPayment = (p: any) => ({
  id: p.id,
  projectId: p.projectId,
  projectName: p.project.name,
  clientName: p.project.lead.name,
  mobile: p.project.lead.mobile,
  date: p.date,
  amount: p.amount,
  method: p.method,
  status: p.status,
  reference: p.reference ?? undefined,
  notes: p.notes ?? undefined,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

/**
 * GET /api/payments
 * GET /api/payments?projectId=123
 */
export const getPayments = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;

    const where: any = {};
    if (projectId) where.projectId = Number(projectId);

    const payments = await prisma.payment.findMany({
      where,
      include: {
        project: {
          include: { lead: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return res.json(payments.map(mapPayment));
  } catch (err) {
    console.error("getPayments error", err);
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};

/**
 * POST /api/payments
 */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const {
      projectId,
      date,
      amount,
      method,
      status,
      reference,
      notes,
    } = req.body;

    // Validate project
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
      include: { lead: true },
    });

    if (!project) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const payment = await prisma.payment.create({
      data: {
        projectId: Number(projectId),
        date: new Date(date),
        amount: Number(amount),
        method: method as PaymentMethod,
        status: status as PaymentStatus,
        reference,
        notes,
      },
      include: {
        project: { include: { lead: true } },
      },
    });

    return res.status(201).json(mapPayment(payment));
  } catch (err) {
    console.error("createPayment error", err);
    return res.status(500).json({ message: "Failed to create payment" });
  }
};

/**
 * PUT /api/payments/:id
 */
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const { date, amount, method, status, reference, notes } = req.body;

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        amount: amount !== undefined ? Number(amount) : undefined,
        method: method as PaymentMethod,
        status: status as PaymentStatus,
        reference,
        notes,
      },
      include: {
        project: { include: { lead: true } },
      },
    });

    return res.json(mapPayment(payment));
  } catch (err) {
    console.error("updatePayment error", err);
    return res.status(500).json({ message: "Failed to update payment" });
  }
};

/**
 * DELETE /api/payments/:id
 */
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.payment.delete({ where: { id } });

    return res.status(204).send();
  } catch (err) {
    console.error("deletePayment error", err);
    return res.status(500).json({ message: "Failed to delete payment" });
  }
};