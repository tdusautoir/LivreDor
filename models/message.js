let connection = require("../config/db");
let moment = require("../config/moment");

class Message {
  constructor(row) {
    this.row = row;
  }

  get id() {
    return this.row.id;
  }

  get content() {
    return this.row.content;
  }

  get created_at() {
    return moment(this.row.created_at);
  }

  get user() {
    return this.row.user;
  }

  static create(content, user, callback) {
    connection.query(
      "INSERT INTO messages SET content = ?, user = ?, created_at = ?",
      [content, user, new Date()],
      (err, result) => {
        if (err) throw err;
        callback(result);
      }
    );
  }

  static find(username, callback) {
    connection.query(
      "SELECT * FROM messages WHERE user = ?",
      [username],
      (err, rows) => {
        if (err) throw err;
        callback(rows.map((row) => new Message(row)));
      }
    );
  }

  static all(callback) {
    connection.query("SELECT * FROM messages", (err, rows) => {
      if (err) throw err;
      callback(rows.map((row) => new Message(row)));
    });
  }
}

module.exports = Message;
