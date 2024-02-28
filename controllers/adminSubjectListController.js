const db = require('../models/db');

const ITEMS_PER_PAGE = 10;

function getSubjectList(page, search) {
  return new Promise((resolve, reject) => {
    let sql = `
  SELECT
    subject_id,
    subject_name,
    taught_by,
    user_details.full_name
  FROM
    subjects
  JOIN
    user_details ON subjects.taught_by = user_details.user_id
  WHERE
    '' = ? OR
    subject_id LIKE ? OR
    subject_name LIKE ? OR
    taught_by LIKE ? OR
    user_details.full_name LIKE ?
  LIMIT ?, ?;
`;

    // Using placeholders to prevent SQL injection
    const searchTermPattern = `%${search}%`;
    const values = [
      search, searchTermPattern, searchTermPattern, searchTermPattern, searchTermPattern,
      (page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
        return;
      }

      // Fetch total count of items without pagination
      let countSql = `
        SELECT COUNT(*) AS total FROM subjects
        WHERE
          '' = ? OR
          subject_id LIKE ? OR
          subject_name LIKE ? OR
          taught_by LIKE ?;
      `;

      const countValues = [
        search, searchTermPattern, searchTermPattern, searchTermPattern];

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



const deleteSubject = (req, res) => {
  const subjectId = req.params.subjectId;
  let sql = 'DELETE FROM subjects WHERE subject_id = ?';

  db.query(sql, [subjectId], (error, result) => {
    if (error) {
      console.error('Error deleting subject:', error);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send();
      } else {
        res.status(404).send('Subject not found');
      }
    }
  });
};




module.exports = {
    getSubjectList,
    deleteSubject
};
