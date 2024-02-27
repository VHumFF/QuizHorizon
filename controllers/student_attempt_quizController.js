const db = require('../models/db');



function getQuestions(quizId) {
    return new Promise((resolve, reject) => {
      // Modify your SQL query based on the search criteria
        let sql = 'SELECT question_id, question, options FROM questions WHERE quiz_id = ?';
  
        db.query(sql, quizId, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            }
            resolve({ rows: results});
        });
    });
}



module.exports = {
    getQuestions
};
