const db = require("../config/db");
const databaseQuery = require("../utils/databaseQuery");

function registerProject(app) {
  //-------------------------------------------PROJECT-----------------------------------------------

  //Route to get all projects
  app.get("/api/projects", (req, res) => {
    db.query(
      "SELECT projet.*, client.client_name, SUM(user_task.time_spent) as time_spent FROM `projet` INNER JOIN user_task ON projet.id = user_task.id_projet LEFT JOIN client ON client.id = projet.id_client GROUP BY projet.id;",
      (err, result) => {
        if (err) console.log(err);
        res.send(result);
      }
    );
  });

  //get client project by the client id in the devis table
  app.get("/api/project", (req, res) => {
    const client_id = req.query.client_id;
    db.query("SELECT * FROM projet WHERE id_client = ?", [client_id], (err, result) => {
      if (err) console.log(err);
      res.send(result);
    });
  });

  //Route to get project by is id
  app.get("/api/projects/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM projet WHERE id = ?", [id], (err, result) => {
      if (err) console.log(err);
      res.send(result[0]);
    });
  });
}
module.exports = registerProject;
