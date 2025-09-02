/*
  Warnings:

  - Made the column `color_id` on table `allocation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `allocation` DROP FOREIGN KEY `allocation_color_id_fkey`;

-- DropIndex
DROP INDEX `allocation_color_id_fkey` ON `allocation`;

DELETE FROM allocation WHERE color_id IS NULL;

-- AlterTable
ALTER TABLE `allocation` MODIFY `color_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `allocation` ADD CONSTRAINT `allocation_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `allocation_color`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
