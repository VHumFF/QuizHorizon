const db = require('../models/db');

function login(req, res) {
    let sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    let query = db.query(sql, [req.body.username, req.body.password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            req.session.user = result[0];
            if(result[0].role == "student"){
                res.redirect('/student_dashboard');
            }
            else if(result[0].role == "instructor"){
                res.redirect('/instructor_dashboard');
            }
            else if(result[0].role == "admin"){
                res.redirect('/admin_dashboard');
            }
        } else {
            res.render('index', { loginFailed: true });
        }
    });
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.send('Error occurred during logout');
        } else {
            res.redirect('/');
        }
    });
}


module.exports = {
    login,
    logout,
};
