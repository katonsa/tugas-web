const express =  require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended:true }))
app.use(express.json())

const todoRouter = require('./routers/todo')
const userRouter = require('./routers/user');

app.use([userRouter, todoRouter])

app.get('/', (req,res) => {
  res.send(`
    <html>
      <body>
        <form action="/todo" method="post">
          <input name="description" />
            <button>Add</button>
        </form>
      </body>
    </html>`
  )
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

server.on('upgrade', function (request, socket, head) {
  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit('connection', ws, request);
  });
});

server.listen(3000, function() {
  console.log('> Server listening on 3000...');
});