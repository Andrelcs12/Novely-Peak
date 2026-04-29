-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_onboardingDone_idx" ON "User"("onboardingDone");
