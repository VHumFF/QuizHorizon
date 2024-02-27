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


function change_password(current_password, new_password, confirm_password, user_id, callback) {
    if (new_password !== confirm_password) {
        callback(null, "Passwords do not match");
    } else if(new_password.length < 7 || new_password.length > 20){
        callback(null, "Password format wrong");
    }else {
        let sql = 'SELECT password FROM users WHERE user_id = ?';
        db.query(sql, user_id, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                callback('Internal Server Error', null);
                return;
            }
            if (results.length === 0) {
                callback('User not found', null);
                return;
            }
            if (current_password !== results[0].password) {
                callback(null, "Current password incorrect");

            } else {
                let updateSql = 'UPDATE users SET password = ? WHERE user_id = ?';
                db.query(updateSql, [new_password, user_id], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error('Error updating password:', updateErr);
                        callback('Internal Server Error', null);
                        return;
                    }
                    // Password updated successfully
                    callback(null, 'Password updated successfully');
                });
            }
        });
    }
}

//res.render('index', { loginFailed: true });

module.exports = {
    getUserInfo,
    change_password
};
