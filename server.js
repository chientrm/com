import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import express from 'express';
import path from 'path';
import { usersTable } from './schema.js';
import fetch from 'node-fetch';

const app = express();
const PORT = 4000;

const db = drizzle('file:local.db');
const SALT_ROUNDS = 12;
const TURNSTILE_SECRET = 'your-turnstile-secret-key';

async function verifyCaptcha(token) {
    const response = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: TURNSTILE_SECRET,
                response: token,
            }),
        }
    );
    const data = await response.json();
    return data.success;
}

app.use(
    express.static(
        path.join(path.dirname(new URL(import.meta.url).pathname), 'dist')
    )
);

app.use(express.json());

app.post('/api/login', async (req, res) => {
    const { username, password, captchaToken } = req.body;

    if (!(await verifyCaptcha(captchaToken))) {
        return res.status(400).json({ message: 'CAPTCHA verification failed' });
    }

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
    const { username, password, captchaToken } = req.body;

    if (!(await verifyCaptcha(captchaToken))) {
        return res.status(400).json({ message: 'CAPTCHA verification failed' });
    }

    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

    await db.insert(usersTable).values({ username, passwordHash });

    res.json({ message: 'Registration successful', username });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
