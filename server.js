import express from 'express';
import path from 'path';
import { drizzle } from 'drizzle-orm/libsql';

const app = express();
const PORT = 3000;

const db = drizzle();

// Serve static files from the "dist" directory
app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'dist')));

app.use(express.json()); // Middleware to parse JSON request bodies

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Add logic to authenticate user
    res.json({ message: 'Login successful', username });
});

// Register route
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    // Add logic to register user
    res.json({ message: 'Registration successful', username });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
