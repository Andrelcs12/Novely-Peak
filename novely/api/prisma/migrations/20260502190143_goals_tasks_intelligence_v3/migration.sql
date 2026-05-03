/*
  Warnings:

  - You are about to drop the column `order` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "GoalProgressMode" AS ENUM ('MANUAL', 'TASKS', 'HYBRID');

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "healthScore" INTEGER,
ADD COLUMN     "lastCalculatedAt" TIMESTAMP(3),
ADD COLUMN     "progressMode" "GoalProgressMode" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "riskLevel" "RiskLevel",
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "targetProgress" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "why" TEXT;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "order",
ADD COLUMN     "actualTime" INTEGER,
ADD COLUMN     "focusTime" INTEGER,
ADD COLUMN     "position" INTEGER,
ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "Goal_status_userId_idx" ON "Goal"("status", "userId");

-- CreateIndex
CREATE INDEX "Task_goalId_status_idx" ON "Task"("goalId", "status");
