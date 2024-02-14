require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST, // Modifié pour MAMP
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD, // Mot de passe par défaut de MAMP root mACOS
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT, // Port par défaut de MAMP 8889 mACOS
});
if (db) {
  console.log("Connecté à la base de données MySQL!");
} else {
  console.log("Erreur de connexion à la base de données MySQL!");
}

module.exports = db;
