let mysql = require("mysql");
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "livreDor",
});

connection.connect();

module.exports = connection;
