const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hopoptask-react-node-mysql",
});

module.exports = db;
