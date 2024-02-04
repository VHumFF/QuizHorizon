const db = require('../models/db');


function getUserCount(callback) {
    let sql = 'SELECT COUNT(*) as userCount FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const userCount = results[0].userCount;
        callback(null, userCount);
    });
}

function getSubjectCount(callback) {
    let sql = 'SELECT COUNT(*) as subjectCount FROM subjects';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const subjectCount = results[0].subjectCount;
        callback(null, subjectCount);
    });
}



module.exports = {
    getUserCount,
    getSubjectCount
};
