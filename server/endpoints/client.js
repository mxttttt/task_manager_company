const db = require("../config/db");
const databaseQuery = require("../utils/databaseQuery");

function registerClient(app) {
  //-------------------------------------------CLIENT-----------------------------------------------

  //get clients from the client table
  app.get("/api/clients", (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const offset = (page - 1) * 10;

    const fetchPromise = new Promise((resolve, reject) => {
      db.query("SELECT * FROM client ORDER BY client_name ASC LIMIT ? OFFSET ?", [limit, offset], (err, result) => {
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
}

module.exports = registerClient;
