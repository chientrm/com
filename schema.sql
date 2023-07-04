CREATE TABLE Com_User(
    username text PRIMARY KEY NOT NULL,
    passwordHash text NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Com_Ask(
    id integer PRIMARY KEY AUTOINCREMENT,
    username text NOT NULL,
    content text NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP
);