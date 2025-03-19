/*
  Warnings:

  - Added the required column `duration` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` ADD COLUMN `duration` VARCHAR(191) NOT NULL,
    ADD COLUMN `equipment` VARCHAR(191) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `level` VARCHAR(191) NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;
