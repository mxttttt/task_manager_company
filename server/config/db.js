const mysql = require("mysql");

const db = mysql.createConnection({
  host: "127.0.0.1", // Modifié pour MAMP
  user: "root",
  password: "", // Mot de passe par défaut de MAMP root mACOS
  database: "hopoptask-react-node-mysql",
  port: 3306, // Port par défaut de MAMP 8889 mACOS
});
if (db) {
  console.log("Connecté à la base de données MySQL!");
} else {
  console.log("Erreur de connexion à la base de données MySQL!");
}

module.exports = db;
