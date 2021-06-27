const WebSocket = require('ws');

// Implementasi ke-2
// Client cukup request ke endpoint via http, server kirim pesan/data ke tiap client tiap ada perubahan data todo.
// Client akan memanipulasi data yang ada di client berdasarkan pesan/data yang dikirim dari server.

const wss = new WebSocket.Server({ noServer: true });

function broadcastMessage(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = {
  webSocketServer: wss,
  broadcastMessage,
};

