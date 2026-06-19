/*
  Warnings:

  - You are about to drop the column `archivedAt` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `healthScore` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `lastCalculatedAt` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `riskLevel` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `targetProgress` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `why` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `actualTime` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `archivedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `isRecurring` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `recurrenceRule` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Task` table. All the data in the column will be lost.
  - The `energyLevel` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `discipline` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `focusLevel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `goal` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `onboardingCompletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `onboardingDone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workStyle` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Streak` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StreakHistory` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `position` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "HabitFrequencyType" AS ENUM ('FIXED_DAYS', 'WEEKLY_COUNT');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('ARTICLE', 'VIDEO', 'DOCUMENT', 'TOOL', 'TWITTER', 'GITHUB', 'OTHER');

-- CreateEnum
CREATE TYPE "EnergyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- DropForeignKey
ALTER TABLE "Streak" DROP CONSTRAINT "Streak_userId_fkey";

-- DropForeignKey
ALTER TABLE "StreakHistory" DROP CONSTRAINT "StreakHistory_userId_fkey";

-- DropIndex
DROP INDEX "Goal_dueDate_idx";

-- DropIndex
DROP INDEX "Goal_priority_idx";

-- DropIndex
DROP INDEX "Goal_status_userId_idx";

-- DropIndex
DROP INDEX "Task_goalId_status_idx";

-- DropIndex
DROP INDEX "User_onboardingDone_idx";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "archivedAt",
DROP COLUMN "category",
DROP COLUMN "color",
DROP COLUMN "completedAt",
DROP COLUMN "dueDate",
DROP COLUMN "healthScore",
DROP COLUMN "icon",
DROP COLUMN "lastCalculatedAt",
DROP COLUMN "projectId",
DROP COLUMN "riskLevel",
DROP COLUMN "score",
DROP COLUMN "startedAt",
DROP COLUMN "targetProgress",
DROP COLUMN "why",
ADD COLUMN     "targetDate" TIMESTAMP(3),
ALTER COLUMN "progressMode" SET DEFAULT 'TASKS';

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "actualTime",
DROP COLUMN "archivedAt",
DROP COLUMN "category",
DROP COLUMN "isRecurring",
DROP COLUMN "recurrenceRule",
DROP COLUMN "source",
DROP COLUMN "startedAt",
DROP COLUMN "weight",
ADD COLUMN     "links" JSONB DEFAULT '[]',
ADD COLUMN     "metadata" JSONB,
DROP COLUMN "energyLevel",
ADD COLUMN     "energyLevel" "EnergyLevel" NOT NULL DEFAULT 'MEDIUM',
ALTER COLUMN "position" SET NOT NULL,
ALTER COLUMN "position" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "discipline",
DROP COLUMN "focusLevel",
DROP COLUMN "goal",
DROP COLUMN "onboardingCompletedAt",
DROP COLUMN "onboardingDone",
DROP COLUMN "workStyle";

-- DropTable
DROP TABLE "Streak";

-- DropTable
DROP TABLE "StreakHistory";

-- DropEnum
DROP TYPE "DisciplineLevel";

-- DropEnum
DROP TYPE "RiskLevel";

-- DropEnum
DROP TYPE "StreakStatus";

-- DropEnum
DROP TYPE "UserGoal";

-- DropEnum
DROP TYPE "WorkStyle";

-- CreateTable
CREATE TABLE "UserSpotify" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSpotify_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subtask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "frequencyType" "HabitFrequencyType" NOT NULL DEFAULT 'FIXED_DAYS',
    "frequencyDays" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5, 6, 7]::INTEGER[],
    "weeklyTargetCount" INTEGER NOT NULL DEFAULT 7,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "maxStreak" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HabitLog" (
    "id" TEXT NOT NULL,
    "loggedDate" DATE NOT NULL,
    "habitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "domain" TEXT,
    "favicon" TEXT,
    "image" TEXT,
    "type" "LinkType" NOT NULL DEFAULT 'ARTICLE',
    "aiSummary" TEXT,
    "aiTags" TEXT[],
    "notes" JSONB DEFAULT '[]',
    "readingTime" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSpotify_spotifyId_key" ON "UserSpotify"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSpotify_userId_key" ON "UserSpotify"("userId");

-- CreateIndex
CREATE INDEX "Subtask_taskId_idx" ON "Subtask"("taskId");

-- CreateIndex
CREATE INDEX "Habit_userId_idx" ON "Habit"("userId");

-- CreateIndex
CREATE INDEX "HabitLog_habitId_idx" ON "HabitLog"("habitId");

-- CreateIndex
CREATE INDEX "HabitLog_loggedDate_idx" ON "HabitLog"("loggedDate");

-- CreateIndex
CREATE UNIQUE INDEX "HabitLog_habitId_loggedDate_key" ON "HabitLog"("habitId", "loggedDate");

-- CreateIndex
CREATE INDEX "LinkCategory_userId_idx" ON "LinkCategory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkCategory_userId_name_key" ON "LinkCategory"("userId", "name");

-- CreateIndex
CREATE INDEX "Link_userId_idx" ON "Link"("userId");

-- CreateIndex
CREATE INDEX "Link_categoryId_idx" ON "Link"("categoryId");

-- CreateIndex
CREATE INDEX "Link_type_idx" ON "Link"("type");

-- CreateIndex
CREATE INDEX "Link_isFavorite_idx" ON "Link"("isFavorite");

-- CreateIndex
CREATE INDEX "Link_isArchived_idx" ON "Link"("isArchived");

-- CreateIndex
CREATE INDEX "Task_position_idx" ON "Task"("position");

-- AddForeignKey
ALTER TABLE "UserSpotify" ADD CONSTRAINT "UserSpotify_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitLog" ADD CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkCategory" ADD CONSTRAINT "LinkCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "LinkCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
