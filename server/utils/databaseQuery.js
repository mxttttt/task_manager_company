function databaseQuery(db, query, params) {
  return new Promise(function (resolve, reject) {
    db.query(query, params, function (err, result) {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
} // export default databaseQuery;
module.exports = databaseQuery;
