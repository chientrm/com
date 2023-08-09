CREATE TABLE Com_User(
    username text PRIMARY KEY NOT NULL,
    email text UNIQUE,
    emailCode integer,
    passwordHash text NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Com_Thread(
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

CREATE TABLE Com_Ent(
    url text PRIMARY KEY NOT NULL,
    username text NOT NULL DEFAULT 'chientrm',
    approvedAt datetime,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP
);