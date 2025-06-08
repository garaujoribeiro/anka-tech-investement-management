/*
  Warnings:

  - You are about to drop the column `number_of_transactions` on the `allocations` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `allocations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(12,4)`.
  - You are about to alter the column `quantity` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(12,4)`.

*/
-- DropForeignKey
ALTER TABLE `allocations` DROP FOREIGN KEY `allocations_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_asset_id_fkey`;

-- DropIndex
DROP INDEX `allocations_asset_id_fkey` ON `allocations`;

-- AlterTable
ALTER TABLE `allocations` DROP COLUMN `number_of_transactions`,
    MODIFY `quantity` DECIMAL(12, 4) NOT NULL;

-- AlterTable
ALTER TABLE `transactions` MODIFY `quantity` DECIMAL(12, 4) NOT NULL;

-- AddForeignKey
ALTER TABLE `allocations` ADD CONSTRAINT `allocations_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
