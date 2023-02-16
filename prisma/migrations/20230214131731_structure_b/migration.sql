/*
  Warnings:

  - You are about to drop the `photosinalbums` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `photosInAlbums` DROP FOREIGN KEY `photosInAlbums_albumId_fkey`;

-- DropForeignKey
ALTER TABLE `photosInAlbums` DROP FOREIGN KEY `photosInAlbums_photoId_fkey`;

-- DropTable
DROP TABLE `photosInAlbums`;

-- CreateTable
CREATE TABLE `_AlbumToPhoto` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AlbumToPhoto_AB_unique`(`A`, `B`),
    INDEX `_AlbumToPhoto_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AlbumToPhoto` ADD CONSTRAINT `_AlbumToPhoto_A_fkey` FOREIGN KEY (`A`) REFERENCES `Album`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AlbumToPhoto` ADD CONSTRAINT `_AlbumToPhoto_B_fkey` FOREIGN KEY (`B`) REFERENCES `Photo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
