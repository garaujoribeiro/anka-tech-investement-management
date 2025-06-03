/*
  Warnings:

  - A unique constraint covering the columns `[client_id,asset_id]` on the table `allocations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `allocations_client_id_asset_id_key` ON `allocations`(`client_id`, `asset_id`);
