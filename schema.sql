CREATE TABLE Com_User(
    username text PRIMARY KEY NOT NULL,
    passwordHash text NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP
);