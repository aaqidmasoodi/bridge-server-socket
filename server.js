const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Handle new connections
wss.on('connection', (ws) => {
    console.log('A new client connected.');

    // Handle incoming messages
    ws.on('message', (message) => {
        console.log('Received:', message.toString());

        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');