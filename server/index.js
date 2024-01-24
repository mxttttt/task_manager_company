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

//Route to get all projects
app.get("/projects", (req, res) => {
  db.query(
    "SELECT projet.*, user_task.client_name, SUM(user_task.time_spent) as time_spent FROM `projet` INNER JOIN user_task ON projet.id = user_task.id_projet  GROUP BY projet.id;",
    (err, result) => {
      if (err) console.log(err);
      res.send(result);
    }
  );
});

//Route to get project by is id
app.get("/projects/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM projet WHERE id = ?", [id], (err, result) => {
    if (err) console.log(err);
    res.send(result[0]);
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

//Route to get user by is id
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) console.log(err);
    res.send(result[0]);
  });
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

// get user task by user_id in user_task table, sorted by created_at in descending order
app.get("/get/user_task", (req, res) => {
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
// get user task by user_id in user_task table, sorted by created_at in descending order
app.get("/admin/get/user_task", (req, res) => {
  const user_id = req.query.user_id;
  db.query("SELECT * FROM user_task WHERE user_id = ? AND completed = 1 ORDER BY created_at DESC", [user_id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.send(result);
    }
  });
});

app.get("/admin/get/project_task/:id", (req, res) => {
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
app.delete("/user_task/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM user_task WHERE id = ?", [id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

//get clients from the client table
app.get("/clients", (req, res) => {
  const page = req.query.page || 1;
  const offset = (page - 1) * 10;
  // db.query("SELECT * FROM client ORDER BY client_name ASC LIMIT 10 OFFSET ?", [offset], (err, result) => {
  //   if (err) console.log(err);
  //   res.send(result);
  // });
  // db.query("SELECT COUNT(*) AS total FROM client", (err, result) => {
  //   if (err) console.log(err);
  //   res.send(result);
  // });
  const fetchPromise = new Promise((resolve, reject) => {
    db.query("SELECT * FROM client ORDER BY client_name ASC LIMIT 10 OFFSET ?", [offset], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
  const countPromise = new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS total FROM client", (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  Promise.all([fetchPromise, countPromise]).then((values) => {
    const [clients, count] = values;
    res.send({ clients, total: count[0].total, total_pages: Math.ceil(count[0].total / 10) });
  });
});

//get client project by the client id in the devis table
app.get("/project", (req, res) => {
  const client_id = req.query.client_id;
  db.query("SELECT * FROM projet WHERE id_client = ?", [client_id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

//mark the task as done
app.post("/task_done", (req, res) => {
  const user_id = req.body.user_id;
  const date = req.body.date;
  const query = "UPDATE user_task SET completed = true WHERE user_id = ? AND created_at = ?";
  db.query(query, [user_id, date], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.post("/mark_task_completed", (req, res) => {
  const id = req.body.task_id;
  const query = "UPDATE user_task SET completed = true WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
