const express =  require('express');
const cors = require('cors');
const http = require('http');
const wss = require('./wss');

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

server.on('upgrade', function (request, socket, head) {
  wss.webSocketServer.handleUpgrade(request, socket, head, function (ws) {
    wss.webSocketServer.emit('connection', ws, request);
  });
});

server.listen(3000, function() {
  console.log('> Server listening on 3000...');
});