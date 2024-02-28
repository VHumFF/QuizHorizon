const db = require('../models/db');

const ITEMS_PER_PAGE = 10;

function getAttemptList(page, search, quizID) {
  return new Promise((resolve, reject) => {

    let sql = `SELECT attempts.user_id, user_details.full_name
    FROM attempts JOIN user_details ON attempts.user_id = user_details.user_id
    WHERE ("" = ? OR full_name LIKE ?) AND attempts.quiz_id = ?
    GROUP BY attempts.user_id
    LIMIT ?, ?;
    `;


    const searchTermPattern = `%${search}%`;
    const values = [
      search, searchTermPattern, quizID,
      (page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
        return;
      }

      let countSql = `SELECT COUNT(DISTINCT attempts.user_id) AS total
      FROM attempts JOIN user_details ON attempts.user_id = user_details.user_id
      WHERE ("" = ? OR full_name LIKE ?) AND attempts.quiz_id = ?;`;

      const countValues = [search, searchTermPattern, quizID];

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


module.exports = {
    getAttemptList,

};
