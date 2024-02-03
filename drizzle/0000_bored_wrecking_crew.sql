CREATE TABLE `Com_Ent` (
	`url` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`approvedAt` text
);
CREATE TABLE `Com_Thread` (
	`username` text NOT NULL,
	`parentId` integer,
	`content` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE `Com_User` (
	`username` text PRIMARY KEY NOT NULL,
	`passwordHash` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
