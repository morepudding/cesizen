/*
  Warnings:

  - A unique constraint covering the columns `[userId,activityId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `favorite` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Favorite_userId_activityId_key` ON `Favorite`(`userId`, `activityId`);
