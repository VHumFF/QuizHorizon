const db = require('../models/db');


function getUserInfo(req, callback) {
    const user_id = req.session.user.user_id; // Assuming user_id is stored in req.session.user
    let sql = 'SELECT full_name, contact, address, email FROM user_details WHERE user_id = ?';

    db.query(sql, user_id, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            callback({ error: 'Internal Server Error' });
            return;
        }
        const user_info = results[0];
        callback(null, user_info);
    });
}



module.exports = {
    getUserInfo,
};
