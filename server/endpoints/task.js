const db = require("../config/db");
const databaseQuery = require("../utils/databaseQuery");

function registerTask(app) {
  //-------------------------------------------TASK-----------------------------------------------

  //get user tasks by is user_job_id
  app.get("/api/tasks", (req, res) => {
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

  //mark the task as done
  app.post("/api/task_done", (req, res) => {
    const user_id = req.body.user_id;
    const date = req.body.date;
    const query = "UPDATE user_task SET completed = true WHERE user_id = ? AND created_at = ?";
    db.query(query, [user_id, date], (err, result) => {
      if (err) console.log(err);
      res.send(result);
    });
  });

  app.post("/api/mark_task_completed", (req, res) => {
    const id = req.body.task_id;
    const query = "UPDATE user_task SET completed = true WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) console.log(err);
      res.send(result);
    });
  });
}

module.exports = registerTask;
