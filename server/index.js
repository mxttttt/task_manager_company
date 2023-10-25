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
      console.log(result);
      res.send(result);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
