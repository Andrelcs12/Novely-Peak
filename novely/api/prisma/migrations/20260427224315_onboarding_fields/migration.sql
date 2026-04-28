/*
  Warnings:

  - The `priority` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `onboardingProfileDone` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserGoal" AS ENUM ('WORK', 'STUDY', 'PROJECTS', 'LIFE');

-- CreateEnum
CREATE TYPE "WorkStyle" AS ENUM ('MINIMAL', 'BALANCED', 'STRUCTURED');

-- CreateEnum
CREATE TYPE "DisciplineLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "priority",
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "onboardingProfileDone",
ADD COLUMN     "discipline" "DisciplineLevel",
ADD COLUMN     "goal" "UserGoal",
ADD COLUMN     "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workStyle" "WorkStyle",
ALTER COLUMN "username" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");

-- CreateIndex
CREATE INDEX "Task_completed_idx" ON "Task"("completed");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
