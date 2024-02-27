const express = require('express');
const router = express.Router();
const restrictTo = require('../middlewares/auth_middleware');
const dashboardController = require('../controllers/dashboardController');
const instructor_subject_list = require('../controllers/instructor_subject_listController');
const instructor_quizzeslist = require('../controllers/instructor_quizzeslistController');
const question_management = require('../controllers/question_managementController');


router.get('/profile_info', (req, res) => {
    dashboardController.getUserInfo(req, (err, user_info) => {
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


router.delete('/quizzes/:quizId', instructor_quizzeslist.deleteQuiz);


router.get('/questions/:quizId', restrictTo('instructor'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('question_management');
    }
});



router.get('/api/ins-questionlist', async (req, res) => {
    try {
        const quizId = req.query.quizId;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || "";
        const questions = await question_management.getQuestionList(page, search, quizId);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/api/question', async (req, res) => {
    try {
        const questionId = req.query.questionId;
        const question = await question_management.getQuestion(questionId);
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/updateQuestion', (req, res) => {
    const { questionData } = req.body;
  
    question_management.updateQuestion(questionData);
  
    res.status(200).json({ message: 'Question update successfully' });
});


router.post('/addQuestion', (req, res) => {
    const { questionData } = req.body;
  
    question_management.addQuestion(questionData);
  
    res.status(200).json({ message: 'Question added successfully' });
});


router.delete('/question/:questionId', question_management.deleteQuestion);

module.exports = router;