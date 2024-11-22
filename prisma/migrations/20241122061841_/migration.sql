/*
  Warnings:

  - A unique constraint covering the columns `[rewardId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rewardId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Quiz` ADD COLUMN `rewardId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Reward` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Reward_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Quiz_rewardId_key` ON `Quiz`(`rewardId`);

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_rewardId_fkey` FOREIGN KEY (`rewardId`) REFERENCES `Reward`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
