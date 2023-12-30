const express = require("express");
const db = require("./config/db");
const cors = require("cors");

const app = express();

const PORT = 3002;
app.use(cors());
app.use(express.json());

//Route to get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

//Route to get on users from is email
app.get("/user", (req, res) => {
  const email = req.query.email;
  db.query(
    "SELECT users.id, users.email,users.nom,users.prénom, users.salt, users.password, users.user_job_id, job.job_name FROM users INNER JOIN job ON users.user_job_id = job.id WHERE email = ?",
    [email],
    (err, result) => {
      if (err) console.log(err);
      res.send(result);
    }
  );
});

//get user tasks by is user_job_id
app.get("/tasks", (req, res) => {
  const user_job_id = req.query.user_job_id;
  db.query(
    "SELECT tasks.id, tasks.task_name, tasks.task_code, tasks.task_job_id, job.job_name FROM tasks INNER JOIN job ON tasks.task_job_id = job.id WHERE tasks.task_job_id = ?",
    [user_job_id],
    (err, result) => {
      if (err) console.log(err);
      res.send(result);
    }
  );
});

//post user task
app.post("/user_task", (req, res) => {
  const user_id = req.body.user_id;
  const user_email = req.body.user_email;
  const task_id = req.body.task_id;
  const task_name = req.body.task_name;
  const task_code = req.body.task_code;
  const time_spent = req.body.time_spent;
  const client = req.body.client;
  const devis = req.body.devis;
  const date = req.body.date;
  const completed = 0;
  db.query(
    "INSERT INTO user_task (user_id, user_email, task_id, client_name, devis_code, task_name, task_code, time_spent, completed, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      user_id,
      user_email,
      task_id,
      client,
      devis,
      task_name,
      task_code,
      time_spent,
      completed,
      date,
    ],
    (err, result) => {
      if (err) console.log(err);
      res.send(result);
    }
  );
});

// get user task by user_id in user_task table, sorted by created_at in descending order
app.get("/get/user_task", (req, res) => {
  const user_id = req.query.user_id;
  db.query(
    "SELECT * FROM user_task WHERE user_id = ? ORDER BY created_at DESC",
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

//delete user task by is user_id in user_task table
app.delete("/user_task/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM user_task WHERE id = ?", [id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

//get clients from the client table
app.get("/clients", (req, res) => {
  db.query("SELECT * FROM client ORDER BY id", (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

//get client devis by the client id in the devis table
app.get("/devis", (req, res) => {
  const client_id = req.query.client_id;
  db.query(
    "SELECT * FROM devis_client WHERE id_client = ?",
    [client_id],
    (err, result) => {
      if (err) console.log(err);
      res.send(result);
    }
  );
});

//mark the task as done
app.post("/task_done", (req, res) => {
  const user_id = req.body.user_id;
  const date = req.body.date;
  const query =
    "UPDATE user_task SET completed = true WHERE user_id = ? AND created_at = ?";
  db.query(query, [user_id, date], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
