const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to generate a random color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    // Assign a random color to the user
    const userColor = getRandomColor();

    socket.on('user-message', (msg) => {
        // Send the message along with the user's color
        io.emit('message', { text: msg, color: userColor });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
