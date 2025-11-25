import { Request, Response, NextFunction } from 'express';
import prisma from "../utils/prisma";
import { FollowupStatus, LeadStatus, LeadBudget, QuotationStatus } from "@prisma/client";

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      mobile,
      email,
      whatsapp,
      technology,
      receivedDate,
      leadSource,
      followupStatus,
      followupDate,
      budget,
      leadStatus,
      description
    } = req.body;

    // Fetch existing client by mobile
    const existingLeads = await prisma.lead.findMany({
      where: { mobile },
      orderBy: { createdAt: "desc" }
    });

    let finalName = name;
    let finalEmail = email;
    let finalWhatsapp = whatsapp || mobile;

    if (existingLeads.length > 0) {
      // Use existing client details
      const prev = existingLeads[0];
      finalName = prev.name;
      finalEmail = prev.email ?? email;
      finalWhatsapp = prev.whatsapp ?? whatsapp ?? mobile;
    }

    const lead = await prisma.lead.create({
      data: {
        name: finalName,
        mobile,
        email: finalEmail,
        whatsapp: finalWhatsapp,
        technology,
        receivedDate: new Date(receivedDate),
        leadSource,
        followupStatus,
        followupDate: followupDate ? new Date(followupDate) : null,
        budget,
        leadStatus,
        description
      }
    });

    return res.status(201).json({
      success: true,
      lead,
      isNewClient: existingLeads.length === 0,
      message: existingLeads.length === 0
        ? "New client created with first requirement"
        : "Existing client: new requirement added"
    });

  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      leads
    });

  } catch (error) {
    next(error);
  }
};

export const getLeadsGrouped = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" }
    });

    const grouped = leads.reduce((acc, row) => {
      if (!acc[row.mobile]) {
        acc[row.mobile] = {
          client: {
            name: row.name,
            mobile: row.mobile,
            email: row.email,
            whatsapp: row.whatsapp
          },
          requirements: []
        };
      }
      acc[row.mobile].requirements.push(row);
      return acc;
    }, {} as any);

    res.json({
      success: true,
      grouped
    });

  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { quotations: true },
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, lead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        technology: data.technology,
        receivedDate: data.receivedDate ? new Date(data.receivedDate) : undefined,
        leadSource: data.leadSource,
        followupStatus: data.followupStatus,
        followupDate: data.followupDate ? new Date(data.followupDate) : undefined,
        budget: data.budget,
        leadStatus: data.leadStatus,
        description: data.description
      }
    });

    return res.json({ success: true, updated });

  } catch (error) {
    next(error);
  }
};


export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.lead.delete({ where: { id } });

    return res.json({ success: true, message: "Requirement deleted successfully" });

  } catch (error) {
    next(error);
  }
};

// 🔍 For quotation popup: get lead by mobile number
export const getLeadByMobile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mobile } = req.params;

    const leads = await prisma.lead.findMany({
      where: { mobile },
      orderBy: { createdAt: "desc" },
    });

    // No existing client
    if (leads.length === 0) {
      return res.json({
        exists: false,
        client: null,
        requirements: []
      });
    }

    // Extract client details from first entry
    const { name, email, whatsapp } = leads[0];

    return res.json({
      exists: true,
      client: { name, mobile, email, whatsapp },
      requirements: leads
    });

  } catch (error) {
    next(error);
  }
};