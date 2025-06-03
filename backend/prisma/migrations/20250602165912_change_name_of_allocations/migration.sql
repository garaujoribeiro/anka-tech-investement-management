/*
  Warnings:

  - You are about to drop the `client_asset_allocations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `client_asset_allocations` DROP FOREIGN KEY `client_asset_allocations_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `client_asset_allocations` DROP FOREIGN KEY `client_asset_allocations_client_id_fkey`;

-- DropTable
DROP TABLE `client_asset_allocations`;

-- CreateTable
CREATE TABLE `allocations` (
    `id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `asset_id` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `purchase_price` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `allocations` ADD CONSTRAINT `allocations_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocations` ADD CONSTRAINT `allocations_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
