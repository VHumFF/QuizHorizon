const express = require('express');
const router = express.Router();
const restrictTo = require('../middlewares/auth_middleware');
const userListController = require('../controllers/userListController');
const adminSubjectListController = require('../controllers/adminSubjectListController');


router.get('/user_list', restrictTo('admin'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('user_list');
    }
});

router.get('/create_user', restrictTo('admin'), (req, res) => {
  if (!req.session.user) {
      res.redirect('/');
  } else {
      res.render('create_user');
  }
});

router.get('/admin_subjectlist', restrictTo('admin'), (req, res) => {
  if (!req.session.user) {
      res.redirect('/');
  } else {
      res.render('admin_subjectlist');
  }
});

router.get('/create_subject', restrictTo('admin'), (req, res) => {
  if (!req.session.user) {
      res.redirect('/');
  } else {
      res.render('create_subject');
  }
});


router.get('/api/user-details', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const user = await userListController.getUserDetails(page, search);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/users/:userId', userListController.deleteUser);


router.get('/api/subject-list', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    const subject = await adminSubjectListController.getSubjectList(page, search);
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/subject/:subjectId', adminSubjectListController.deleteSubject);

module.exports = router;