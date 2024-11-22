/*
  Warnings:

  - You are about to drop the column `choiceId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the `Choice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `optionId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_choiceId_fkey`;

-- DropForeignKey
ALTER TABLE `Choice` DROP FOREIGN KEY `Choice_questionId_fkey`;

-- AlterTable
ALTER TABLE `Answer` DROP COLUMN `choiceId`,
    ADD COLUMN `optionId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Choice`;

-- CreateTable
CREATE TABLE `Option` (
    `id` VARCHAR(191) NOT NULL,
    `option` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isCorrect` BOOLEAN NOT NULL,

    UNIQUE INDEX `Option_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `Option`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
