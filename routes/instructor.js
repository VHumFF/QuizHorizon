const express = require('express');
const router = express.Router();
const restrictTo = require('../middlewares/auth_middleware');
const instructor_dashboardController = require('../controllers/instructor_dashboardController');


router.get('/profile_info', (req, res) => {
    instructor_dashboardController.getUserInfo(req, (err, user_info) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        res.json(user_info);
    });
});


router.get('/subject_list', restrictTo('instructor'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('subject_list');
    }
});


module.exports = router;