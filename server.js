import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import express from 'express';
import path from 'path';
import { usersTable } from './schema.js';

const app = express();
const PORT = 4000;

const db = drizzle();
const SALT_ROUNDS = 12; // Increase salt rounds for better security

app.use(
    express.static(
        path.join(path.dirname(new URL(import.meta.url).pathname), 'dist')
    )
);

app.use(express.json()); // Middleware to parse JSON request bodies

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .get();

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        res.json({ message: 'Login successful', username });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Register route
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await db.insert(usersTable).values({ username, passwordHash });

    res.json({ message: 'Registration successful', username });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
