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

function submitQuiz(answers, user_id) {
    
    answers.answers.forEach((answer) => {
        let sql = 'INSERT INTO attempts (question_id, answer, user_id)VALUES (?, ?, ?)';
        const data = [answer.questionID, answer.answer, user_id]; 
        db.query(sql, data, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            }
        });
    })
    
}



module.exports = {
    getQuestions,
    submitQuiz
};
