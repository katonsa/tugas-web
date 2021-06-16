const sqlite3 = require('sqlite3').verbose();
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
            console.log('Error creating `todo` table.', err.message);
          }
      });

      db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT)`,
    (err) => {
        if (err) {
          console.log('Error creating `users` table.', err.message);
        }
    });
  }
});

module.exports = db;