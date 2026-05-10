/*
  Warnings:

  - You are about to drop the column `date` on the `StreakHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,dateKey]` on the table `StreakHistory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateKey` to the `StreakHistory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `StreakHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "StreakHistory_userId_date_idx";

-- DropIndex
DROP INDEX "StreakHistory_userId_date_key";

-- AlterTable
ALTER TABLE "Streak" ADD COLUMN     "frozenDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastDateKey" TEXT;

-- AlterTable
ALTER TABLE "StreakHistory" DROP COLUMN "date",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dateKey" TEXT NOT NULL,
ADD COLUMN     "streakAfter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tasksTotal" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "StreakStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo';

-- CreateIndex
CREATE INDEX "Streak_status_idx" ON "Streak"("status");

-- CreateIndex
CREATE INDEX "Streak_lastDateKey_idx" ON "Streak"("lastDateKey");

-- CreateIndex
CREATE INDEX "StreakHistory_userId_idx" ON "StreakHistory"("userId");

-- CreateIndex
CREATE INDEX "StreakHistory_dateKey_idx" ON "StreakHistory"("dateKey");

-- CreateIndex
CREATE INDEX "StreakHistory_userId_dateKey_idx" ON "StreakHistory"("userId", "dateKey");

-- CreateIndex
CREATE UNIQUE INDEX "StreakHistory_userId_dateKey_key" ON "StreakHistory"("userId", "dateKey");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");
