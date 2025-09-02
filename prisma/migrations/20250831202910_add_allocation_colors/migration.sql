/*
  Warnings:

  - You are about to drop the column `color` on the `allocation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `allocation` DROP COLUMN `color`,
    ADD COLUMN `color_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `allocation_color` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `allocation` ADD CONSTRAINT `allocation_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `allocation_color`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocation_color` ADD CONSTRAINT `allocation_color_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
