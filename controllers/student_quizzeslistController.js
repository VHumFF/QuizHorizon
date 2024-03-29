const db = require('../models/db');

const ITEMS_PER_PAGE = 10;

function getQuizzesList(page, search, subject_id) {
  return new Promise((resolve, reject) => {
    // Modify your SQL query based on the search criteria
    let sql = `SELECT quiz_id, quiz_name FROM quizzes WHERE ('' = ? OR quiz_id LIKE ? OR quiz_name LIKE ?) AND subject_id = ? AND status = "open" ORDER BY quiz_id DESC LIMIT ?, ?;`;


    const searchTermPattern = `%${search}%`;
    const values = [
      search, searchTermPattern, searchTermPattern, subject_id,
      (page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
        return;
      }


      let countSql = `SELECT COUNT(*) AS total FROM quizzes WHERE ('' = ? OR quiz_id LIKE ? OR quiz_name LIKE ?) AND subject_id = ? AND status = "open"`;

      const countValues = [search, searchTermPattern, searchTermPattern, subject_id];

      db.query(countSql, countValues, (countErr, countResults) => {
        if (countErr) {
          console.error('Error executing MySQL query for count:', countErr);
          reject(countErr);
          return;
        }

        const totalCount = countResults[0].total;
        resolve({ rows: results, total: totalCount });
      });
    });
  });
}


function getAttempt(quiz_id, user_id) {
  return new Promise((resolve, reject) => {
    //check whether student have attempted the quiz
    let sql = `SELECT COUNT(*) AS count FROM attempts WHERE user_id = ? AND quiz_id = ?;`;

    const values = [user_id, quiz_id];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
        return;
      }

      const count = results[0].count;

      resolve(count);

    });
  });
}




module.exports = {
    getQuizzesList,
    getAttempt
};
