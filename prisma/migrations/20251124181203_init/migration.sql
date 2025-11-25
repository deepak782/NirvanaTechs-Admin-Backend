-- CreateEnum
CREATE TYPE "LeadBudget" AS ENUM ('LT_1_LAKH', 'BETWEEN_1_3L', 'GT_3_LAKH');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTATION_SENT', 'CLOSED', 'LOST');

-- CreateEnum
CREATE TYPE "FollowupStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_INTERESTED');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'APPROVED');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "whatsapp" VARCHAR(20),
    "technology" TEXT NOT NULL,
    "receivedDate" TIMESTAMP(3) NOT NULL,
    "leadSource" TEXT NOT NULL,
    "followupStatus" "FollowupStatus" NOT NULL,
    "followupDate" TIMESTAMP(3),
    "budget" "LeadBudget" NOT NULL,
    "leadStatus" "LeadStatus" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "refNo" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leadId" TEXT NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_mobile_idx" ON "Lead"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_refNo_key" ON "Quotation"("refNo");

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
