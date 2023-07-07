CREATE TABLE Com_User(
    username text PRIMARY KEY NOT NULL,
    passwordHash text NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Com_Ask(
    id integer PRIMARY KEY AUTOINCREMENT,
    parentId integer,
    username text NOT NULL,
    content text NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Com_Counter(
    username text PRIMARY KEY NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP
);