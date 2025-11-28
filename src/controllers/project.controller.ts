import { Request, Response } from "express";
import { PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Map DB model -> Frontend shape
 */
const mapProject = (p: any) => {
  const amountReceived = p.payments
  ?.filter((pay: any) => pay.status === "PAID")   // COUNT ONLY PAID
  .reduce((sum: number, pay: any) => sum + pay.amount, 0) || 0;

  return {
    id: p.id,
    name: p.name,
    leadId: p.leadId,
    mobile: p.lead.mobile,
    clientName: p.lead.name,
    technology: p.lead.technology,
    startDate: p.startDate,
    endDate: p.endDate,
    status: p.status,
    totalAmount: p.totalAmount,
    description: p.description ?? undefined,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    amountReceived,
    balanceAmount: p.totalAmount - amountReceived,
  };
};

/**
 * GET /api/projects
 */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { lead: true, payments: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json(projects.map(mapProject));
  } catch (err) {
    console.error("getProjects error", err);
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/**
 * GET /api/projects/:id
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const project = await prisma.project.findUnique({
      where: { id },
      include: { lead: true, payments: true },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json(mapProject(project));
  } catch (err) {
    console.error("getProjectById error", err);
    return res.status(500).json({ message: "Failed to fetch project" });
  }
};

/**
 * GET /api/projects/by-mobile/:mobile
 */
export const getProjectsByMobile = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.params;

    const projects = await prisma.project.findMany({
      where: {
        lead: {
          mobile: mobile,
        },
      },
      include: { lead: true, payments: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json(projects.map(mapProject));
  } catch (err) {
    console.error("getProjectsByMobile error", err);
    return res.status(500).json({ message: "Failed to fetch projects by mobile" });
  }
};

/**
 * POST /api/projects
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      name,
      leadId,
      startDate,
      endDate,
      status,
      totalAmount,
      description,
    } = req.body;

    // Validate lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: String(leadId) },
    });

    if (!lead) {
      return res.status(400).json({ message: "Invalid leadId" });
    }

    const project = await prisma.project.create({
      data: {
        name,
        leadId: String(leadId),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status as ProjectStatus,
        totalAmount: Number(totalAmount),
        description,
      },
      include: { lead: true, payments: true },
    });

    return res.status(201).json(mapProject(project));
  } catch (err) {
    console.error("createProject error", err);
    return res.status(500).json({ message: "Failed to create project" });
  }
};

/**
 * PUT /api/projects/:id
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      name,
      startDate,
      endDate,
      status,
      totalAmount,
      description,
    } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status: status as ProjectStatus,
        totalAmount: totalAmount !== undefined ? Number(totalAmount) : undefined,
        description,
      },
      include: { lead: true, payments: true },
    });

    return res.json(mapProject(project));
  } catch (err) {
    console.error("updateProject error", err);
    return res.status(500).json({ message: "Failed to update project" });
  }
};

/**
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.project.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    console.error("deleteProject error", err);
    return res.status(500).json({ message: "Failed to delete project" });
  }
};