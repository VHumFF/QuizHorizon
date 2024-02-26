const db = require('../models/db');

const ITEMS_PER_PAGE = 10; // Adjust the number of items per page as needed

function getQuestionList(page, search, quiz_id) {
  return new Promise((resolve, reject) => {
    // Modify your SQL query based on the search criteria
    let sql = `
    SELECT question_id, question
    FROM questions 
    WHERE ('' = ? OR question_id LIKE ? OR question LIKE ?) 
    AND quiz_id = ? 
    ORDER BY quiz_id DESC
    LIMIT ?, ?;
`;

    // Using placeholders to prevent SQL injection
    const searchTermPattern = `%${search}%`;
    const values = [
      search, searchTermPattern, searchTermPattern, quiz_id,
      (page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
        return;
      }

      // Fetch total count of items without pagination
      let countSql = `SELECT COUNT(*) AS total FROM questions
      WHERE
          ('' = ? OR question_id LIKE ? OR question LIKE ?) AND quiz_id = ?
      `;

      const countValues = [
        search, searchTermPattern, searchTermPattern, quiz_id];

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


function getQuestion(questionId) {
    return new Promise((resolve, reject) => {
      // Modify your SQL query based on the search criteria
        let sql = 'SELECT question, options, answer FROM questions WHERE question_id = ?';
  
        db.query(sql, questionId, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            }
            resolve({ rows: results});
        });
    });
}

function updateQuestion(questionData) {
    return new Promise((resolve, reject) => {
      // Modify your SQL query based on the search criteria
        let sql = 'UPDATE questions SET question = ?, options = ?, answer = ? WHERE question_id = ?';
        const data = [questionData.question, questionData.options, questionData.answer, questionData.question_id]; 
  
        db.query(sql, data, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            }
            resolve({ rows: results});
        });
    });
}


function addQuestion(questionData) {
    return new Promise((resolve, reject) => {
      // Modify your SQL query based on the search criteria
        let sql = 'INSERT INTO questions (question, options, answer, quiz_id) VALUES (?, ?, ?, ?)';
        const data = [questionData.question, questionData.options, questionData.answer, questionData.quizId]; 
  
        db.query(sql, data, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            }
            resolve({ rows: results});
        });
    });
}


const deleteQuestion = (req, res) => {
    const questionId = req.params.questionId;
    let sql = 'DELETE FROM questions WHERE question_id = ?';
  
    db.query(sql, [questionId], (error, result) => {
      if (error) {
        console.error('Error deleting question:', error);
        res.status(500).send('Internal Server Error');
      } else {
        if (result.affectedRows > 0) {
          res.status(200).send(); // Respond with success status
        } else {
          res.status(404).send('Question not found'); // User with the specified ID not found
        }
      }
    });
  };


module.exports = {
    getQuestionList,
    deleteQuestion,
    getQuestion,
    updateQuestion,
    addQuestion
};
