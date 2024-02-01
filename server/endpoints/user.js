const db = require("../config/db");
const databaseQuery = require("../utils/databaseQuery");

function registerUser(app) {
  //-------------------------------------USER-----------------------------------------------------

  //Route to get all users
  app.get("/api/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
      if (err) console.log(err);
      res.send(result);
    });
  });

  //Route to get on users from is email
  app.get("/api/user", (req, res) => {
    const email = req.query.email;
    db.query(
      "SELECT users.id, users.email,users.nom,users.prenom, users.salt, users.password, users.user_job_id, users.picture, job.job_name, job.role FROM users INNER JOIN job ON users.user_job_id = job.id WHERE email = ?",
      [email],
      (err, result) => {
        if (err) console.log(err);
        res.send(result);
      }
    );
  });

  //Route to get user by is id
  app.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT users.*, job.job_name FROM users INNER JOIN job on users.user_job_id = job.id WHERE users.id = ?", [id], (err, result) => {
      if (err) console.log(err);
      res.send(result[0]);
    });
  });
}

module.exports = registerUser;
