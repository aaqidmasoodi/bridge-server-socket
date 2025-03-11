const WebSocket = require('ws');

const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

// Track the number of connected clients
let clientCount = 0;

wss.on('connection', (ws) => {
    if (clientCount >= 2) {
        console.log("Chatroom full.")
        ws.close(1000, 'Chatroom is full. Only two clients are allowed.');
        return;
    }

    clientCount++;
    console.log(`A new client connected. Total clients: ${clientCount}`);

    // Notify all clients about the new connection
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'connection', count: clientCount }));
        }
    });

    ws.on('message', (message) => {
        console.log('Received:', message.toString());

        // Broadcast the message to all other clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        clientCount--;
        console.log(`A client disconnected. Total clients: ${clientCount}`);

        // Notify all clients about the disconnection
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'connection', count: clientCount }));
            }
        });
    });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);