const db = require('../models/db');

const ITEMS_PER_PAGE = 10;

function getSubjectList(page, search, user_id) {
  return new Promise((resolve, reject) => {

    let sql = `
    SELECT subject_id, subject_name 
    FROM subjects 
    WHERE ('' = ? OR subject_id LIKE ? OR subject_name LIKE ?) 
    AND taught_by = ? 
    LIMIT ?, ?;
`;

    const searchTermPattern = `%${search}%`;
    const values = [
      search, searchTermPattern, searchTermPattern, user_id,
      (page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
        return;
      }


      let countSql = `SELECT COUNT(*) AS total FROM subjects
      WHERE
          ('' = ? OR subject_id LIKE ? OR subject_name LIKE ?) AND taught_by = ?
      `;

      const countValues = [
        search, searchTermPattern, searchTermPattern, user_id];

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
    getSubjectList,
};
