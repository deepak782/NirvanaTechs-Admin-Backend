import { Request, Response } from "express";
import { PrismaClient, FollowupStatus } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Map DB model → UI model
 */
const mapFollowup = (f: any) => ({
  id: f.id,
  leadId: f.leadId,
  mobile: f.lead.mobile,
  name: f.lead.name,
  technology: f.lead.technology,
  followupDate: f.followupDate,
  status: f.status,
  notes: f.notes ?? undefined,
  nextFollowupDate: f.nextFollowupDate,
  createdAt: f.createdAt,
  updatedAt: f.updatedAt,
});

/**
 * GET /api/followups
 * GET /api/followups?leadId=xxxx
 */
export const getFollowups = async (req: Request, res: Response) => {
  try {
   const { leadId, mobile, date } = req.query;

    const where: any = {};

    // filter by lead
    if (leadId) where.leadId = String(leadId);

    // filter by mobile
    if (mobile) {
    where.lead = {
        mobile: {
        contains: String(mobile),
        mode: "insensitive",
        }
    };
    }

    // filter by date
    if (date) {
        const dateStr = String(date);
        const target = new Date(dateStr);

        const nextDay = new Date(target);
        nextDay.setDate(target.getDate() + 1);

        where.followupDate = {
            gte: target,
            lt: nextDay,
        };
    }

    const followups = await prisma.followUp.findMany({
      where,
      include: { lead: true },
      orderBy: { followupDate: "desc" },
    });

    return res.json(followups.map(mapFollowup));
  } catch (err) {
    console.error("getFollowups error", err);
    return res.status(500).json({ message: "Failed to fetch followups" });
  }
};

/**
 * GET /api/followups/:id
 */
export const getFollowupById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const followup = await prisma.followUp.findUnique({
      where: { id },
      include: { lead: true },
    });

    if (!followup) {
      return res.status(404).json({ message: "Followup not found" });
    }

    return res.json(mapFollowup(followup));
  } catch (err) {
    console.error("getFollowupById error", err);
    return res.status(500).json({ message: "Failed to fetch followup" });
  }
};

/**
 * POST /api/followups
 */
export const createFollowup = async (req: Request, res: Response) => {
  try {
    const { leadId, followupDate, status, notes, nextFollowupDate } = req.body;

    // Validate lead
    const lead = await prisma.lead.findUnique({
      where: { id: String(leadId) },
    });

    if (!lead) {
      return res.status(400).json({ message: "Invalid leadId" });
    }

    const created = await prisma.followUp.create({
      data: {
        leadId: String(leadId),
        followupDate: new Date(followupDate),
        status: status as FollowupStatus,
        notes,
        nextFollowupDate: nextFollowupDate ? new Date(nextFollowupDate) : null,
      },
      include: { lead: true },
    });

    return res.status(201).json(mapFollowup(created));
  } catch (err) {
    console.error("createFollowup error", err);
    return res.status(500).json({ message: "Failed to create followup" });
  }
};

/**
 * PUT /api/followups/:id
 */
export const updateFollowup = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { followupDate, status, notes, nextFollowupDate } = req.body;

    const updated = await prisma.followUp.update({
      where: { id },
      data: {
        followupDate: followupDate ? new Date(followupDate) : undefined,
        status: status as FollowupStatus,
        notes,
        nextFollowupDate: nextFollowupDate
          ? new Date(nextFollowupDate)
          : undefined,
      },
      include: { lead: true },
    });

    return res.json(mapFollowup(updated));
  } catch (err) {
    console.error("updateFollowup error", err);
    return res.status(500).json({ message: "Failed to update followup" });
  }
};

/**
 * DELETE /api/followups/:id
 */
export const deleteFollowup = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.followUp.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    console.error("deleteFollowup error", err);
    return res.status(500).json({ message: "Failed to delete followup" });
  }
};

/**
 * PATCH /api/followups/:id/status
 * Marks a followup as COMPLETED
 */
export const markFollowupCompleted = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const updated = await prisma.followUp.update({
      where: { id },
      data: { status: FollowupStatus.COMPLETED },
      include: { lead: true },
    });

    return res.json(mapFollowup(updated));
  } catch (err) {
    console.error("markFollowupCompleted error", err);
    return res.status(500).json({ message: "Failed to update followup status" });
  }
};