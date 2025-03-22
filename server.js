import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import express from 'express';
import { SignJWT, jwtVerify } from 'jose';
import fetch from 'node-fetch';
import ViteExpress from 'vite-express';
import { usersTable } from './schema.js';
import { exec } from 'child_process';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const db = drizzle('file:local.db');
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.TURNSTILE_SECRET;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Utility functions
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
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return (
        typeof username === 'string' &&
        username.length >= 3 &&
        username.length <= 20 &&
        usernameRegex.test(username)
    );
}

function validatePassword(password) {
    return typeof password === 'string' && password.length >= 8;
}

function sendErrorResponse(res, statusCode, message) {
    res.status(statusCode).json({ message });
}

async function findUserByUsername(username) {
    return db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .get();
}

async function generateToken(username, role = null) {
    return new SignJWT({ username, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30d')
        .sign(new TextEncoder().encode(JWT_SECRET));
}

// Utility function to strip ANSI escape codes
function stripAnsiCodes(input) {
    return input.replace(
        // Regex to match ANSI escape codes
        /\u001b\[[0-9;]*m/g,
        ''
    );
}

// Utility function to map priority numbers to level text
function translatePriority(priority) {
    const levels = {
        0: 'EMERGENCY',
        1: 'ALERT',
        2: 'CRITICAL',
        3: 'ERROR',
        4: 'WARNING',
        5: 'NOTICE',
        6: 'INFO',
        7: 'DEBUG',
    };
    return levels[priority] || 'UNKNOWN';
}

// Middleware
async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.error('No token provided in Authorization header.');
        return sendErrorResponse(res, 401, 'Unauthorized access.');
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );
        req.user = { username: payload.username, role: payload.role };
        next();
    } catch (err) {
        sendErrorResponse(res, 403, 'Access forbidden.');
    }
}

async function authenticateAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        console.error('User is not an admin:', req.user); // Debugging log
        return sendErrorResponse(res, 403, 'Admin privileges required.');
    }
    next();
}

// Routes
app.use(express.json());

app.post('/api/login', async (req, res) => {
    const { username, password, captchaToken } = req.body;

    if (!username || !password) {
        return sendErrorResponse(
            res,
            400,
            'Username and password are required.'
        );
    }

    if (!(await verifyCaptcha(captchaToken))) {
        return sendErrorResponse(res, 400, 'CAPTCHA verification failed.');
    }

    const user = await findUserByUsername(username);

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
        const token = await generateToken(username, user.role || 'user');
        res.json({ message: 'Login successful.', username, token });
    } else {
        sendErrorResponse(res, 401, 'Invalid username or password.');
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password, captchaToken } = req.body;

    if (!validateUsername(username) || !validatePassword(password)) {
        return sendErrorResponse(
            res,
            400,
            'Invalid username or password format.'
        );
    }

    if (!(await verifyCaptcha(captchaToken))) {
        return sendErrorResponse(res, 400, 'CAPTCHA verification failed.');
    }

    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
    await db.insert(usersTable).values({ username, passwordHash, role: null });

    const token = await generateToken(username, null);
    res.json({ message: 'Registration successful.', username, token });
});

app.get('/api/check-auth', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Authentication verified.' });
});

function isValidJson(line) {
    return line.trim().startsWith('{') && line.trim().endsWith('}');
}

app.get(
    '/api/admin/journalctl',
    authenticateToken,
    authenticateAdmin,
    (req, res) => {
        exec('journalctl -n 100 -o json --no-pager', (error, stdout) => {
            if (error) {
                console.error('Failed to retrieve logs:', error);
                res.status(500).json({ message: 'Failed to retrieve logs.' });
                return;
            }

            const logs = stdout
                .split('\n')
                .filter((line) => isValidJson(line))
                .map((line) => {
                    const entry = JSON.parse(line);
                    return {
                        timestamp: entry.__REALTIME_TIMESTAMP,
                        host: entry._HOSTNAME,
                        service: entry._SYSTEMD_UNIT,
                        pid: entry._PID,
                        level: translatePriority(entry.PRIORITY),
                        message: Array.isArray(entry.MESSAGE)
                            ? stripAnsiCodes(
                                  Buffer.from(entry.MESSAGE).toString('utf-8')
                              )
                            : stripAnsiCodes(entry.MESSAGE || ''),
                    };
                });

            res.json({ logs });
        });
    }
);

app.get(
    '/api/admin/systemctl',
    authenticateToken,
    authenticateAdmin,
    (req, res) => {
        const searchQuery = req.query.search?.toLowerCase() || '';

        exec(
            'systemctl list-units --type=service --no-pager --no-legend',
            (error, stdout, stderr) => {
                if (error) {
                    return sendErrorResponse(
                        res,
                        500,
                        'Failed to retrieve services.'
                    );
                }

                let services = stdout
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line);

                if (searchQuery) {
                    services = services.filter((service) =>
                        service.toLowerCase().includes(searchQuery)
                    );
                }

                res.json({ services });
            }
        );
    }
);

app.get(
    '/api/admin/journalctl/:serviceName',
    authenticateToken,
    authenticateAdmin,
    (req, res) => {
        const { serviceName } = req.params;

        exec(
            `journalctl -u ${serviceName} -n 100 -o json --no-pager`,
            (error, stdout) => {
                if (error) {
                    console.error(
                        `Failed to retrieve logs for service ${serviceName}:`,
                        error
                    );
                    res.status(500).json({
                        message: `Failed to retrieve logs for service: ${serviceName}`,
                    });
                    return;
                }

                const logs = stdout
                    .split('\n')
                    .filter((line) => isValidJson(line))
                    .map((line) => {
                        const entry = JSON.parse(line);
                        return {
                            timestamp: entry.__REALTIME_TIMESTAMP,
                            host: entry._HOSTNAME,
                            service: entry._SYSTEMD_UNIT,
                            pid: entry._PID,
                            level: translatePriority(entry.PRIORITY),
                            message: Array.isArray(entry.MESSAGE)
                                ? stripAnsiCodes(
                                      Buffer.from(entry.MESSAGE).toString(
                                          'utf-8'
                                      )
                                  )
                                : stripAnsiCodes(entry.MESSAGE || ''),
                        };
                    });

                res.json({ logs });
            }
        );
    }
);

app.get('/api/weather', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res
            .status(400)
            .json({ message: 'Latitude and longitude are required.' });
    }

    console.log('OPENWEATHER_API_KEY:', OPENWEATHER_API_KEY); // Debugging log

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,alerts&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        console.error(
            `Error fetching weather data: ${response.status} ${response.statusText}`
        );
        if (response.status === 401) {
            return res.status(401).json({ message: 'Invalid API key.' });
        }
        return res
            .status(response.status)
            .json({ message: 'Failed to fetch weather data.' });
    }
    const data = await response.json();
    res.json(data);
});

ViteExpress.listen(app, PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
