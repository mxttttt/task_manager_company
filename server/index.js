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
    "SELECT users.id, users.email, users.salt, users.password, users.user_job_id, job.job_name FROM users INNER JOIN job ON users.user_job_id = job.id WHERE email = ?",
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
  const time_spent = req.body.time_spent;
  db.query(
    "INSERT INTO user_task (user_id, user_email, task_id, task_name, time_spent) VALUES (?,?,?,?,?)",
    [user_id, user_email, task_id, task_name, time_spent],
    (err, result) => {
      if (err) console.log(err);
      res.send(result);
    }
  );
});

//get user task by is user_id in user_task table
app.get("/get/user_task", (req, res) => {
  const user_id = req.query.user_id;
  db.query("SELECT * FROM user_task WHERE user_id = ?", [user_id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

//delete user task by is user_id in user_task table
app.delete("/user_task/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM user_task WHERE id = ?", [id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
