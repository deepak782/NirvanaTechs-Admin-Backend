import { PrismaClient, FollowupStatus, LeadBudget, LeadStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.lead.createMany({
    data: [
      {
        name: "Ramesh Kumar",
        mobile: "9876543210",
        email: "ramesh@example.com",
        whatsapp: "9876543210",
        technology: "Website Development",
        receivedDate: new Date("2025-01-10"),
        leadSource: "JustDial",
        followupStatus: FollowupStatus.PENDING,
        followupDate: new Date("2025-01-15"),
        budget: LeadBudget.LT_1_LAKH,
        leadStatus: LeadStatus.NEW,
        description: "Needs a hotel booking website similar to OYO."
      },
      {
        name: "Sandeep Sharma",
        mobile: "9988776655",
        email: "sandeep@example.com",
        whatsapp: "9988776655",
        technology: "Mobile App (Flutter)",
        receivedDate: new Date("2025-01-12"),
        leadSource: "Google Search",
        followupStatus: FollowupStatus.IN_PROGRESS,
        followupDate: new Date("2025-01-20"),
        budget: LeadBudget.BETWEEN_1_3L,
        leadStatus: LeadStatus.CONTACTED,
        description: "Needs app for sales executives to record orders."
      },
      {
        name: "Lakshmi Prasad",
        mobile: "9123456789",
        email: "lakshmi@example.com",
        whatsapp: "9123456789",
        technology: "E-commerce Website",
        receivedDate: new Date("2025-01-18"),
        leadSource: "Direct Call",
        followupStatus: FollowupStatus.COMPLETED,
        followupDate: new Date("2025-01-19"),
        budget: LeadBudget.GT_3_LAKH,
        leadStatus: LeadStatus.QUOTATION_SENT,
        description: "Wants a complete fragrance e-commerce site with admin panel."
      },
      {
        name: "Vikram Reddy",
        mobile: "9000011122",
        email: "vikram@example.com",
        whatsapp: "9000011122",
        technology: "CRM Software",
        receivedDate: new Date("2025-01-20"),
        leadSource: "Referral",
        followupStatus: FollowupStatus.NOT_INTERESTED,
        budget: LeadBudget.LT_1_LAKH,
        leadStatus: LeadStatus.LOST,
        description: "Discussed CRM for hospital but put on hold."
      },
      {
        name: "Harika Sai",
        mobile: "8099887766",
        email: "harika@example.com",
        whatsapp: "8099887766",
        technology: "Logo + Branding + Website",
        receivedDate: new Date("2025-01-22"),
        leadSource: "Instagram",
        followupStatus: FollowupStatus.PENDING,
        followupDate: new Date("2025-01-25"),
        budget: LeadBudget.BETWEEN_1_3L,
        leadStatus: LeadStatus.NEW,
        description: "Needs full branding for a fashion boutique."
      }
    ]
  });

  console.log("🌱 Lead seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });