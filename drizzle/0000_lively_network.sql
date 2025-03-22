CREATE TABLE `users_table` (
	`username` text PRIMARY KEY NOT NULL,
	`passwordHash` text NOT NULL,
	`role` text
);
