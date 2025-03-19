/*
  Warnings:

  - You are about to drop the column `emotion` on the `emotion` table. All the data in the column will be lost.
  - Added the required column `emotionId` to the `Emotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `emotion` DROP COLUMN `emotion`,
    ADD COLUMN `emotionId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `EmotionType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `parentId` INTEGER NULL,

    UNIQUE INDEX `EmotionType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Emotion` ADD CONSTRAINT `Emotion_emotionId_fkey` FOREIGN KEY (`emotionId`) REFERENCES `EmotionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmotionType` ADD CONSTRAINT `EmotionType_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `EmotionType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
