const WebSocket = require('ws');

const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

// Track the number of connected clients
let clientCount = 0;

wss.on('connection', (ws) => {
    clientCount++;
    console.log(`A new client connected. Total clients: ${clientCount}`);

    ws.on('message', (message) => {
        console.log('Received:', message.toString());

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        clientCount--;
        console.log(`A client disconnected. Total clients: ${clientCount}`);
    });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);