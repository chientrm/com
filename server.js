const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
