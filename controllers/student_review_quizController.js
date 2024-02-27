const db = require('../models/db');


function getQuestionsAnswer(quizId, user_id) {
    return new Promise((resolve, reject) => {
        // Modify your SQL query to join the attempts table with the questions table
        let sql = `
            SELECT q.question_id, q.question, q.options, q.answer, a.answer AS user_attempt
            FROM questions q
            LEFT JOIN attempts a ON q.question_id = a.question_id AND a.quiz_id = ? AND a.user_id = ?
            WHERE q.quiz_id = ?
        `;
  
        db.query(sql, [quizId, user_id, quizId], (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
                return;
            }

            resolve({ rows: results });
        });
    });
}






module.exports = {
    getQuestionsAnswer,
};
