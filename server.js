import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs-node';
import bcrypt from 'bcryptjs';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import { count, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import express from 'express';
import fs from 'fs';
import { SignJWT, jwtVerify } from 'jose';
import multer from 'multer';
import path from 'path';
import ViteExpress from 'vite-express';
import { galleryTable, usersTable, imageClassesTable } from './schema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const db = drizzle('file:local.db');
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.TURNSTILE_SECRET;

let mobilenetModel;

// Initialization function to queue unclassified photos
async function initializeUnclassifiedPhotos() {
    console.log('Initializing unclassified photos...');
    const unclassifiedPhotos = await db
        .select()
        .from(galleryTable)
        .where(eq(galleryTable.classifiedAt, null)) // Check for unclassified photos
        .all();

    unclassifiedPhotos.forEach((photo) => {
        classificationQueue.push(photo.id); // Queue photo ID
    });

    if (unclassifiedPhotos.length > 0) {
        console.log(
            `Queued ${unclassifiedPhotos.length} unclassified photos for processing.`
        );
        processClassificationQueue();
    } else {
        console.log('No unclassified photos found.');
    }
}

// Load the MobileNet model and initialize unclassified photos
(async () => {
    mobilenetModel = await mobilenet.load();
    console.log('MobileNet model loaded.');
    await initializeUnclassifiedPhotos();
})();

// Utility functions
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

function stripAnsiCodes(input) {
    return input.replace(/\u001b\[[0-9;]*m/g, '');
}

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

async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return sendErrorResponse(res, 401, 'Unauthorized access.');
    }

    const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
    );
    req.user = { username: payload.username, role: payload.role };
    next();
}

async function authenticateAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return sendErrorResponse(
            res,
            403,
            'Access denied: Admin privileges required.'
        );
    }
    next();
}

// Middleware to log API calls
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use(express.json());

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB per file
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    'Invalid file type. Only JPEG, PNG, and GIF are allowed.'
                )
            );
        }
    },
});

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return sendErrorResponse(
            res,
            400,
            'Username and password are required.'
        );
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
    const { username, password } = req.body;

    if (!validateUsername(username) || !validatePassword(password)) {
        return sendErrorResponse(
            res,
            400,
            'Invalid username or password format.'
        );
    }

    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

    try {
        await db
            .insert(usersTable)
            .values({ username, passwordHash, role: null });
        const token = await generateToken(username, null);
        res.json({
            message: 'Registration successful.',
            username,
            token,
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            sendErrorResponse(res, 400, 'Username already exists.');
        } else {
            console.error('Error during registration:', error);
            sendErrorResponse(res, 500, 'Failed to register user.');
        }
    }
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
            (error, stdout) => {
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

// Classification queue
const classificationQueue = [];

async function processClassificationQueue() {
    while (classificationQueue.length > 0) {
        const photoId = classificationQueue.shift();

        const photo = await db
            .select()
            .from(galleryTable)
            .where(eq(galleryTable.id, photoId))
            .get();

        if (!photo) {
            console.warn(`Photo not found in database: ID ${photoId}`);
            continue;
        }

        const imagePath = path.join('uploads', photo.filename);

        if (!fs.existsSync(imagePath)) {
            console.warn(`File not found: ${imagePath}`);
            continue;
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const decodedImage = tf.node.decodeImage(imageBuffer);

        const predictions = await mobilenetModel.classify(decodedImage);

        const classRecords = predictions.map((prediction) => ({
            imageId: photo.id,
            className: prediction.className,
            probability: prediction.probability,
        }));

        await db.insert(imageClassesTable).values(classRecords);

        // Mark the photo as classified by setting classifiedAt to the current timestamp
        await db
            .update(galleryTable)
            .set({ classifiedAt: Math.floor(Date.now() / 1000) })
            .where(eq(galleryTable.id, photo.id));

        console.log(`Classified image: ID ${photoId}`);
    }
}

app.post(
    '/api/gallery',
    authenticateToken,
    upload.array('photos', 200), // Increase the file limit to 200
    async (req, res) => {
        if (!req.files || !req.files.length) {
            return sendErrorResponse(res, 400, 'No files uploaded.');
        }

        const { username } = req.user;
        const uploadedAt = Math.floor(Date.now() / 1000); // Unix timestamp

        const photoRecords = req.files.map((file) => ({
            filename: file.filename,
            uploadedBy: username,
            uploadedAt,
            classifiedAt: null, // Mark as unclassified
        }));

        const insertedPhotos = await db
            .insert(galleryTable)
            .values(photoRecords)
            .returning();

        insertedPhotos.forEach((photo) => {
            classificationQueue.push(photo.id); // Queue photo ID
        });

        processClassificationQueue();

        res.status(200).json({
            message:
                'Photos uploaded successfully and added to the classification queue.',
        });
    }
);

app.post('/api/gallery/describe', authenticateToken, async (req, res) => {
    const { filename } = req.body;

    if (!filename) {
        return sendErrorResponse(res, 400, 'Filename is required.');
    }

    const imagePath = path.join('uploads', filename);

    if (!fs.existsSync(imagePath)) {
        return sendErrorResponse(res, 404, 'Image not found.');
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const decodedImage = tf.node.decodeImage(imageBuffer);

    const predictions = await mobilenetModel.classify(decodedImage);

    const image = await db
        .select()
        .from(galleryTable)
        .where(eq(galleryTable.filename, filename))
        .get();

    if (!image) {
        return sendErrorResponse(res, 404, 'Image not found in database.');
    }

    const classRecords = predictions.map((prediction) => ({
        imageId: image.id,
        className: prediction.className,
        probability: prediction.probability,
    }));

    await db.insert(imageClassesTable).values(classRecords);

    res.status(200).json({ predictions });
});

app.get('/api/gallery', authenticateToken, async (req, res) => {
    const { username } = req.user;
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 photos per page
    const offset = (page - 1) * limit;

    const photos = await db
        .select()
        .from(galleryTable)
        .where(eq(galleryTable.uploadedBy, username))
        .limit(limit)
        .offset(offset)
        .all();

    const photosWithUrls = photos.map((photo) => ({
        id: photo.id,
        filename: photo.filename,
        uploadedBy: photo.uploadedBy,
        uploadedAt: photo.uploadedAt,
        url: `${req.protocol}://${req.get('host')}/uploads/${photo.filename}`,
    }));

    const result = await db
        .select({ count: count(galleryTable.id) })
        .from(galleryTable)
        .where(eq(galleryTable.uploadedBy, username))
        .get();

    const totalCount = result.count;

    res.json({
        photos: photosWithUrls,
        total: totalCount,
        page,
        limit,
    });
});

app.delete('/api/gallery/:photoId', authenticateToken, async (req, res) => {
    const { photoId } = req.params;
    const { username } = req.user;

    if (!photoId) {
        console.error('Photo ID is missing in the request.');
        return sendErrorResponse(res, 400, 'Photo ID is required.');
    }

    const photo = await db
        .select()
        .from(galleryTable)
        .where(eq(galleryTable.id, photoId))
        .get();

    if (!photo) {
        return sendErrorResponse(res, 404, 'Photo not found in database.');
    }

    if (photo.uploadedBy !== username) {
        return sendErrorResponse(
            res,
            403,
            'You are not authorized to delete this photo.'
        );
    }

    const photoPath = path.join('uploads', photo.filename);
    fs.unlink(photoPath, async (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error deleting photo file:', err);
            return sendErrorResponse(res, 500, 'Failed to delete photo file.');
        }

        await db.delete(galleryTable).where(eq(galleryTable.id, photoId));

        res.status(200).json({
            message: 'Photo deleted successfully.',
        });
    });
});

app.get('/api/gallery/by-class', authenticateToken, async (req, res) => {
    const { className } = req.query;

    if (!className) {
        return sendErrorResponse(res, 400, 'Class name is required.');
    }

    const classRecords = await db
        .select()
        .from(imageClassesTable)
        .where(eq(imageClassesTable.className, className))
        .all();

    const imageIds = classRecords.map((record) => record.imageId);

    const images = await db
        .select()
        .from(galleryTable)
        .where(galleryTable.id.in(imageIds))
        .all();

    const imagesWithUrls = images.map((image) => ({
        id: image.id,
        filename: image.filename,
        uploadedBy: image.uploadedBy,
        uploadedAt: image.uploadedAt,
        url: `${req.protocol}://${req.get('host')}/uploads/${image.filename}`,
    }));

    res.status(200).json({ images: imagesWithUrls });
});

app.use('/uploads', express.static('uploads'));

ViteExpress.listen(app, PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
