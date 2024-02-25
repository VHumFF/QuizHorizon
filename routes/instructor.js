const express = require('express');
const router = express.Router();
const restrictTo = require('../middlewares/auth_middleware');
const instructor_dashboardController = require('../controllers/instructor_dashboardController');
const instructor_subject_list = require('../controllers/instructor_subject_listController');


router.get('/profile_info', (req, res) => {
    instructor_dashboardController.getUserInfo(req, (err, user_info) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        res.json(user_info);
    });
});


router.get('/instructor_subject_list', restrictTo('instructor'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('instructor_subject_list');
    }
});

router.get('/api/ins-subject-list', async (req, res) => {
    try {
        const user_id = req.session.user.user_id;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || "";
        const subject = await instructor_subject_list.getSubjectList(page, search, user_id);
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/subjects/:subjectId/quizzes', restrictTo('instructor'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        const subjectId = req.params.subjectId;
        res.render('instructor_quizzeslist', { subjectId: subjectId });
    }
});


module.exports = router;