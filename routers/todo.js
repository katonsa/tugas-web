const router = require('express').Router()
const authenticated = require('../authenticated');
const db = require('../db-connection')
const wss = require('../wss')
router.use(authenticated)

router.post('/todo', (req, res) => {
  const { description } = req.body;
  const sql ='INSERT INTO `todo` (description) VALUES (?)'
  const params = [description];
  db.run(sql, params, function (err, result) {
    if (err){
      res.status(500).json({'error': err.message});
      return;
    }
    res.status(200).json({'error': false, id: this.lastID, message: 'Berhasil ditambahkan.'});
    wss.broadcastMessage({
      action: 'ADD_ITEM',
      data: {
        id: this.lastID,
        description
      },
    })
  })
})

router.get('/todo', (_req, res) => {
  const sql = 'SELECT * FROM `todo`'
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }

    res.json(rows)
  });
});

router.delete('/todo/:id', (req, res) => {
  db.run(
    'DELETE FROM `todo` WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err){
        res.status(400).json({'error': res.message})
        return;
      }

      res.json({'error': false, 'message': 'Record deleted.', changes: this.changes})
      wss.broadcastMessage({
        action: 'REMOVE_ITEM',
        data: {
          id: req.params.id,
        }
      })
  });
});

module.exports = router;
