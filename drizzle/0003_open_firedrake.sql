CREATE TABLE `image_classes_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image_id` integer NOT NULL,
	`class_name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `imageIdIndex` ON `image_classes_table` (`image_id`);--> statement-breakpoint
CREATE INDEX `classNameIndex` ON `image_classes_table` (`class_name`);--> statement-breakpoint
CREATE INDEX `uploadedByIndex` ON `gallery_table` (`uploaded_by`);