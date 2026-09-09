-- Rebrand store defaults from the attar store to the Libaas clothing store.
ALTER TABLE "store_settings"
ALTER COLUMN "storeName" SET DEFAULT 'Libaas',
ALTER COLUMN "supportEmail" SET DEFAULT 'support@libaas.com',
ALTER COLUMN "navbarTitle" SET DEFAULT 'Libaas',
ALTER COLUMN "navbarTitleColor" SET DEFAULT '#2F221A';

ALTER TABLE "Product"
ALTER COLUMN "productType" SET DEFAULT 'MEN';
