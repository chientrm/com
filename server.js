import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import express from 'express';
import fetch from 'node-fetch';
import ViteExpress from 'vite-express';
import { usersTable } from './schema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const db = drizzle('file:local.db');
const SALT_ROUNDS = 12;

async function verifyCaptcha(token) {
    const response = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET,
                response: token,
            }),
        }
    );
    const data = await response.json();
    return data.success;
}

function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Only alphanumeric and underscores
    return (
        typeof username === 'string' &&
        username.length >= 3 &&
        username.length <= 20 &&
        usernameRegex.test(username)
    );
}

function validatePassword(password) {
    return typeof password === 'string' && password.length >= 8; // Simplified for login
}

function sendErrorResponse(res, statusCode, message) {
    res.status(statusCode).json({ message });
}

async function handleCaptchaVerification(captchaToken, res) {
    if (!(await verifyCaptcha(captchaToken))) {
        sendErrorResponse(res, 400, 'CAPTCHA verification failed');
        return false;
    }
    return true;
}

async function findUserByUsername(username) {
    return await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .get();
}

app.use(express.json());

app.post('/api/login', async (req, res) => {
    const { username, password, captchaToken } = req.body;

    if (!username || !password) {
        return sendErrorResponse(
            res,
            400,
            'Username and password are required'
        );
    }

    if (!(await handleCaptchaVerification(captchaToken, res))) return;

    const user = await findUserByUsername(username);

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        res.json({ message: 'Login successful', username });
    } else {
        sendErrorResponse(res, 401, 'Invalid username or password');
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password, captchaToken } = req.body;

    if (!validateUsername(username) || !validatePassword(password)) {
        return sendErrorResponse(
            res,
            400,
            'Invalid username or password format'
        );
    }

    if (!(await handleCaptchaVerification(captchaToken, res))) return;

    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

    await db.insert(usersTable).values({ username, passwordHash });

    res.json({ message: 'Registration successful', username });
});

ViteExpress.listen(app, PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
