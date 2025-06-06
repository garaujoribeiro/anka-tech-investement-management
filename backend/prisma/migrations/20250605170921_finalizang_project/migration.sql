-- DropForeignKey
ALTER TABLE `allocations` DROP FOREIGN KEY `allocations_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `allocations` DROP FOREIGN KEY `allocations_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_client_id_fkey`;

-- DropIndex
DROP INDEX `allocations_asset_id_fkey` ON `allocations`;

-- CreateIndex
CREATE INDEX `allocations_client_id_asset_id_idx` ON `allocations`(`client_id`, `asset_id`);

-- CreateIndex
CREATE INDEX `transactions_date_idx` ON `transactions`(`date`);

-- AddForeignKey
ALTER TABLE `allocations` ADD CONSTRAINT `allocations_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocations` ADD CONSTRAINT `allocations_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `transactions` RENAME INDEX `transactions_asset_id_fkey` TO `transactions_asset_id_idx`;

-- RenameIndex
ALTER TABLE `transactions` RENAME INDEX `transactions_client_id_fkey` TO `transactions_client_id_idx`;
