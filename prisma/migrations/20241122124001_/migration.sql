/*
  Warnings:

  - Added the required column `quizPrice` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Quiz` ADD COLUMN `quizPrice` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `amount` VARCHAR(191) NOT NULL DEFAULT '200000',
    ADD COLUMN `emailVerification` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lockedAmount` VARCHAR(191) NOT NULL DEFAULT '200000';

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `transactionType` ENUM('CREDIT', 'DEBIT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('Pending', 'Completed', 'Failed') NOT NULL,

    UNIQUE INDEX `Transaction_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
