const mysql = require("mysql");

const db = mysql.createConnection({
  host: "127.0.0.1", // Modifié pour MAMP
  user: "root",
  password: "root", // Mot de passe par défaut de MAMP
  database: "hopoptask-react-node-mysql",
  port: 8889, // Port par défaut de MAMP
});
if (db) {
  console.log("Connecté à la base de données MySQL!");
} else {
  console.log("Erreur de connexion à la base de données MySQL!");
}

module.exports = db;
