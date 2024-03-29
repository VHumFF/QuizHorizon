const db = require('../models/db');


function getQuizName(quizId) {
    return new Promise((resolve, reject) => {

        let sql = 'SELECT quiz_name FROM quizzes WHERE quiz_id = ?';

        db.query(sql, quizId, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            }

            if (results.length > 0) {
                resolve(results[0].quiz_name);
            } else {
                reject(new Error('Quiz not found'));
            }
        });
    });
}

function getQuestions(quizId) {
    return new Promise((resolve, reject) => {

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
        let sql = 'INSERT INTO attempts (question_id, answer, user_id, quiz_id)VALUES (?, ?, ?, ?)';
        const data = [answer.questionID, answer.answer, user_id, answer.quiz_ID]; 
        db.query(sql, data, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                reject(err);
            }
        });
    })
    
}



module.exports = {
    getQuizName,
    getQuestions,
    submitQuiz
};
