CREATE TABLE `Product` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `imageUrl` VARCHAR(2048) NULL,
  `partnerUrl` VARCHAR(2048) NOT NULL,
  `status` ENUM('DRAFT', 'ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `Product_slug_key`(`slug`),
  INDEX `Product_status_sortOrder_idx`(`status`, `sortOrder`),
  INDEX `Product_category_idx`(`category`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AffiliateEvent` (
  `id` VARCHAR(191) NOT NULL,
  `type` ENUM('OUTBOUND_CLICK', 'VERIFIED_ORDER', 'COMMISSION_ADJUSTMENT') NOT NULL,
  `productId` VARCHAR(191) NULL,
  `partnerReference` VARCHAR(191) NULL,
  `commissionMinor` INTEGER NULL,
  `currency` VARCHAR(3) NULL,
  `verified` BOOLEAN NOT NULL DEFAULT false,
  `source` VARCHAR(191) NOT NULL DEFAULT 'sentinel',
  `occurredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `AffiliateEvent_partnerReference_key`(`partnerReference`),
  INDEX `AffiliateEvent_type_occurredAt_idx`(`type`, `occurredAt`),
  INDEX `AffiliateEvent_verified_type_idx`(`verified`, `type`),
  PRIMARY KEY (`id`),
  CONSTRAINT `AffiliateEvent_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
