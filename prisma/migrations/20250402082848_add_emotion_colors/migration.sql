/*
  Warnings:

  - You are about to alter the column `category` on the `activity` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `activity` MODIFY `category` ENUM('BIEN_ETRE', 'SPORT', 'ART', 'AVENTURE') NOT NULL;

-- AlterTable
ALTER TABLE `emotiontype` ADD COLUMN `bgColor` VARCHAR(191) NULL,
    ADD COLUMN `color` VARCHAR(191) NULL;
