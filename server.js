
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Serve static files from the current directory
app.use(express.static('.'));

// Handle client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Access your blog at: http://localhost:5000/blog.html');
});
