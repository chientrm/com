import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import express from 'express';
import path from 'path';
import { usersTable } from './schema.js';

const app = express();
const PORT = 4000;

const db = drizzle('file:local.db');
const SALT_ROUNDS = 12;

app.use(
    express.static(
        path.join(path.dirname(new URL(import.meta.url).pathname), 'dist')
    )
);

app.use(express.json());

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .get();

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        res.json({ message: 'Login successful', username });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

    await db.insert(usersTable).values({ username, passwordHash });

    res.json({ message: 'Registration successful', username });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
