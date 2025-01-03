// Import required modules
const express = require('express');
const http = require('http'); // For creating the HTTP server
const { Server } = require('socket.io'); // Import Socket.IO
const path = require('path');

// Create an Express app
const app = express();

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server);

// Serve static files (front-end) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the root route 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle real-time connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for incoming messages
    socket.on('chat message', (msg) => {
        console.log(`Message received: ${msg}`);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, "0.0.0.0",() => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
