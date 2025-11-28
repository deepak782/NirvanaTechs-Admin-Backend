/*
  Warnings:

  - A unique constraint covering the columns `[leadId,followupDate]` on the table `FollowUp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FollowUp_leadId_followupDate_key" ON "FollowUp"("leadId", "followupDate");
