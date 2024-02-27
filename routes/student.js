const express = require('express');
const router = express.Router();
const restrictTo = require('../middlewares/auth_middleware');
const student_subject_list = require('../controllers/student_subject_listController');
const student_quizzeslist = require('../controllers/student_quizzeslistController');
const student_attempt_quiz = require('../controllers/student_attempt_quizController');
const student_review_quiz = require('../controllers/student_review_quizController');


router.get('/student_subject_list', restrictTo('student'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('student_subject_list');
    }
});

router.get('/api/stu-subject-list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || "";
        const subject = await student_subject_list.getSubjectList(page, search);
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/quizzes/:subjectId', restrictTo('student'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('student_quizzeslist');
    }
});

router.get('/api/stu-quizzeslist', async (req, res) => {
    try {
        const subject_id = req.query.subjectID;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || "";
        const quizzes = await student_quizzeslist.getQuizzesList(page, search, subject_id);
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/quiz/attempt/:quizId', restrictTo('student'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('student_attempt_quiz');
    }
});


router.get('/api/getQuizName', async (req, res) => {
    try {
        const quizId = req.query.quizId;
        const quizName = await student_attempt_quiz.getQuizName(quizId);
        res.json(quizName);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/api/getQuizQuestion', async (req, res) => {
    try {
        const quizId = req.query.quizId;
        const questions = await student_attempt_quiz.getQuestions(quizId);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/submitQuiz', (req, res) => {
    const { answer } = req.body;
    const user_id = req.session.user.user_id;
    student_attempt_quiz.submitQuiz(answer, user_id);
  
    res.status(200).json({ message: 'Submit successfully' });
});

router.get('/api/get_attempt', async (req, res) => {
    try {
        const user_id = req.session.user.user_id;
        const quizId = req.query.quizId;
        const attempt = await student_quizzeslist.getAttempt(quizId, user_id);
        res.json(attempt);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/quiz/review/:quizId', restrictTo('student'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('student_review_quiz');
    }
});

router.get('/api/getQuizQuestionAnswer', async (req, res) => {
    try {
        const quizId = req.query.quizId;
        const user_id = req.session.user.user_id;
        const questions = await student_review_quiz.getQuestionsAnswer(quizId, user_id);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;