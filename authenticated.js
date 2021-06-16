const db = require('./db-connection')

module.exports = function (req, res, next) {
    const { username, password } = req.headers
    const sql = "SELECT * FROM users WHERE username = ? and password = ?"
    const params = [username, password]
    db.get(sql, params, (err, row) => {
        if (err) {
          throw err;
        }

        if (row) {
            next()
        } else {
            res.status(401).json({
                error: true,
                message: 'Unauthorized'
            })
        }
    })
}