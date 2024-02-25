const express = require('express');
const router = express.Router();
const restrictTo = require('../middlewares/auth_middleware');
const instructor_dashboardController = require('../controllers/instructor_dashboardController');
const instructor_subject_list = require('../controllers/instructor_subject_listController');
const instructor_quizzeslist = require('../controllers/instructor_quizzeslistController');


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


router.get('/subjects/:subjectId', restrictTo('instructor'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('instructor_quizzeslist');
    }
});

router.get('/subjects/:subjectId', restrictTo('instructor'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('instructor_quizzeslist');
    }
});

router.get('/api/ins-quizzeslist', async (req, res) => {
    try {
        const subject_id = req.query.subjectID;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || "";
        const quizzes = await instructor_quizzeslist.getQuizzesList(page, search, subject_id);
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/validateQuizName', (req, res) => {
    const { quizName } = req.body;
    const quizNameValid = instructor_quizzeslist.validateQuizName(quizName);
  
    res.json(quizNameValid);
  
});

router.post('/createQuiz', (req, res) => {
    const { quizName, subjectId } = req.body;
  
    instructor_quizzeslist.createQuiz(quizName, subjectId);
  
    res.status(200).json({ message: 'Quiz created successfully' });
});


module.exports = router;