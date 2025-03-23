CREATE TABLE `gallery_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`uploaded_by` text NOT NULL,
	`uploaded_at` integer NOT NULL
);
--> statement-breakpoint
DROP TABLE `gallery`;