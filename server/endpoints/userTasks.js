const db = require("../config/db");
const databaseQuery = require("../utils/databaseQuery");

function registerUserTasks(app) {
  //-------------------------------------------USER TASK-----------------------------------------------

  //post user task
  app.post("/api/user_task", (req, res) => {
    const user_id = req.body.user_id;
    const user_email = req.body.user_email;
    const task_id = req.body.task_id;
    const task_name = req.body.task_name;
    const task_code = req.body.task_code;
    const time_spent = req.body.time_spent;
    const client = req.body.client;
    const id_projet = req.body.projet;
    const date = req.body.date;
    const completed = 0;
    db.query(
      "INSERT INTO user_task (user_id, user_email, task_id, client_name, id_projet, task_name, task_code, time_spent, completed, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [user_id, user_email, task_id, client, id_projet, task_name, task_code, time_spent, completed, date],
      (err, result) => {
        if (err) console.log(err);
        res.send(result);
      }
    );
  });

  // get user task by user_id in user_task table, sorted by created_at in descending order in client side
  app.get("/api/get/user_task", (req, res) => {
    const user_id = req.query.user_id;
    db.query(
      "SELECT user_task.*, projet.nom FROM user_task INNER JOIN projet ON user_task.id_projet = projet.id WHERE user_id = ? AND completed = 0 ORDER BY created_at DESC",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.send(result);
        }
      }
    );
  });
  // get user task by user_id in user_task table, sorted by created_at in descending order in admin side
  app.get("/api/admin/get/user_task", (req, res) => {
    const user_id = req.query.user_id;
    db.query(
      "SELECT user_task.*, projet.nom FROM user_task INNER JOIN projet ON user_task.id_projet = projet.id WHERE user_id = ? AND completed = 1 ORDER BY created_at DESC",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.send(result);
        }
      }
    );
  });

  //get user task by user_task by is project id and possible to filter by task_code and date
  app.get("/api/admin/get/project_task/:id", (req, res) => {
    const projectId = req.params.id;
    const { task_code, date } = req.query;

    let query = "SELECT * FROM user_task WHERE id_projet = ?";
    let queryParams = [projectId];

    // Add filtering conditions based on the provided query parameters
    if (task_code) {
      query += " AND task_code = ?";
      queryParams.push(task_code);
    }
    if (date) {
      query += " AND DATE(created_at) = ?";
      queryParams.push(date);
    }

    query += " ORDER BY created_at DESC";

    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error while fetching tasks");
      } else {
        res.send(result);
        console.log(result);
      }
    });
  });

  //delete user task by is user_id in user_task table
  app.delete("/api/user_task/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM user_task WHERE id = ?", [id], (err, result) => {
      if (err) console.log(err);
      res.send(result);
    });
  });
}

module.exports = registerUserTasks;
