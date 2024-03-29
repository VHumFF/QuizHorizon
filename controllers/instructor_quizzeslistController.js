const db = require('../models/db');

const ITEMS_PER_PAGE = 10;

function getQuizzesList(page, search, subject_id) {
  return new Promise((resolve, reject) => {

    let sql = `
    SELECT quiz_id, quiz_name, status
    FROM quizzes 
    WHERE ('' = ? OR quiz_id LIKE ? OR quiz_name LIKE ? OR status LIKE ?) 
    AND subject_id = ? 
    ORDER BY quiz_id DESC
    LIMIT ?, ?;
`;


    const searchTermPattern = `%${search}%`;
    const values = [
      search, searchTermPattern, searchTermPattern, searchTermPattern, subject_id,
      (page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
        return;
      }


      let countSql = `SELECT COUNT(*) AS total FROM quizzes
      WHERE
          ('' = ? OR quiz_id LIKE ? OR quiz_name LIKE ? OR status LIKE ?) AND subject_id = ?
      `;

      const countValues = [
        search, searchTermPattern, searchTermPattern, searchTermPattern, subject_id];

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


function validateQuizName(quizName) {

  // Validate quiz name
  const quizNameRegex = /^[a-zA-Z\s]{3,20}$/;
  if (!quizName || !quizNameRegex.test(quizName)) {
      return false;
  }
  return true;
}

function createQuiz(quizName, subjectId){
  const query = 'INSERT INTO quizzes (quiz_name, status, subject_id) VALUES (?, ?, ?)';
  const data = [quizName, "closed", subjectId]; 
  db.query(query, data, (error, Result, fields) => {
      if (error) {
          console.error('Error inserting into users table:', error);
          return;
      }
  });

}


const deleteQuiz = (req, res) => {
  const quizId = req.params.quizId;
  let sql = 'DELETE FROM quizzes WHERE quiz_id = ?';

  db.query(sql, [quizId], (error, result) => {
    if (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).send('Internal Server Error');
    } else {
      if (result.affectedRows > 0) {
        res.status(200).send(); // Respond with success status
      } else {
        res.status(404).send('Quiz not found');
      }
    }
  });
};


function changeStatus(quizId, callback) {
  const query = "UPDATE quizzes SET status = CASE WHEN status = 'closed' THEN 'open' WHEN status = 'open' THEN 'closed' END WHERE quiz_id = ?;";

  db.query(query, quizId, (error, result) => {
      if (error) {
          console.error('Error updating status:', error);
          callback(error);
          return;
      }
      callback(null);
  });
}

module.exports = {
    getQuizzesList,
    validateQuizName,
    createQuiz,
    deleteQuiz,
    changeStatus
};
