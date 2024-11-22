/*
  Warnings:

  - You are about to drop the column `rewardId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the `Reward` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rewardValue` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Quiz` DROP FOREIGN KEY `Quiz_rewardId_fkey`;

-- AlterTable
ALTER TABLE `Quiz` DROP COLUMN `rewardId`,
    ADD COLUMN `rewardValue` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Reward`;
