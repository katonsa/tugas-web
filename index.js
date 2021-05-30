const express =  require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());

const dbFile = __dirname + '/todos.db';
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(err.message)
    throw err
  } else {
      console.log('Koneksi ke db berhasil.');

      db.run(`CREATE TABLE todo (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description text)`,
      (err) => {
          if (err) {
            console.log('Error creating table.', err.message);
          }
      });  
  }
});

app.use(express.urlencoded({ extended:true }))
app.use(express.json())

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
})

app.post('/todo', (req, res) => {
  const { description } = req.body;
  var sql ='INSERT INTO `todo` (description) VALUES (?)'
  var params = [description];
  db.run(sql, params, function (err, result) {
    if (err){
      res.status(500).json({'error': err.message});
      return;
    }

    res.status(200).json({'error': false, id: this.lastID, message: 'Berhasil ditambahkan.'});
  });
})

app.get('/todo', (_req, res) => {
  const sql = 'select * from `todo`'
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json(rows)
  });
})

app.delete('/todo/:id', (req, res) => {
  db.run(
    'DELETE FROM `todo` WHERE id = ?',
    req.params.id,
    function (err, result) {
        if (err){
            res.status(400).json({'error': res.message})
            return;
        }
        res.json({'error': false, 'message': 'Record deleted.', changes: this.changes})
});
})

app.listen(3000, function() {
  console.log('Server listening ...');
});