/*
  Warnings:

  - You are about to drop the column `purchase_price` on the `allocations` table. All the data in the column will be lost.
  - Added the required column `currentValue` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `allocations` DROP COLUMN `purchase_price`;

-- AlterTable
ALTER TABLE `assets` ADD COLUMN `currentValue` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `symbol` VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `allocation_id` VARCHAR(191) NOT NULL,
    `type` ENUM('BUY', 'SELL') NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_allocation_id_fkey` FOREIGN KEY (`allocation_id`) REFERENCES `allocations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
