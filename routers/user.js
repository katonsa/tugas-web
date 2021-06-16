const router = require('express').Router()
const authenticated = require('../authenticated')
const db = require('../db-connection')

function checkIfNoUser(req, res, next) {
  const sql = "SELECT COUNT(*) as totalUser FROM users"
    db.get(sql, (err, row) => {
        if (err) {
          throw err;
        }
        
        if (row.totalUser < 1) {
          next();
        } else {
          authenticated(req, res, next);
        }
    })
}

function checkIfLastUser(_req, res, next) {
  const sql = "SELECT COUNT(*) as totalUser FROM users"
    db.get(sql, (err, row) => {
        if (err) {
          throw err;
        }
        
        if (row.totalUser < 2) {
          res.status(403).json({
            error: true,
            message: "Last user cant be deleted."
          })
        } else {
          next()
        }
    })
}

router.post('/user', checkIfNoUser, (req, res) => {
  const { username, password } = req.body
  const sql ='INSERT INTO `users` (username, password) VALUES (?, ?)'
  const params = [username, password]

  db.run(sql, params, function (err, result) {
    if (err){
      res.status(500).json({'error': err.message})
      return
    }

    res.status(200).json({'error': false, id: this.lastID, message: 'Berhasil ditambahkan.'})
  })
})

router.get('/user', authenticated, (req, res) => {
  const sql = 'SELECT `id`, `username` FROM `users`'
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message})
      return
    }
    res.json(rows)
  })
})

router.delete('/user/:id', authenticated, checkIfLastUser, (req, res) => {
  const { id: userId } = req.params

  db.run(
    'DELETE FROM `users` WHERE id = ?',
    userId,
    function (err, result) {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }

        res.json({error: false, "message":"Record deleted.", changes: this.changes})
  });
})

module.exports = router;
