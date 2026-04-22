CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price_cents` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_products_name` ON `products` (`name`);