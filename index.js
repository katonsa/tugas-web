const express =  require('express');
const cors = require('cors');

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

app.listen(3000, function() {
  console.log('> Server listening on 3000...');
});