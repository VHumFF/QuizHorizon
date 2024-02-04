const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const restrictTo = require('../middlewares/auth_middleware');
const adminDashboardController = require('../controllers/adminDashboardController');


router.get('/student_dashboard', restrictTo('student'), (req, res) => {
  if (!req.session.user) {
      res.redirect('/');
  } else {
      res.render('student_dashboard');
  }
});

router.get('/instructor_dashboard', restrictTo('instructor'), (req, res) => {
  if (!req.session.user) {
      res.redirect('/');
  } else {
      res.render('instructor_dashboard');
  }
});

router.get('/admin_dashboard', restrictTo('admin'), (req, res) => {
  if (!req.session.user) {
      res.redirect('/');
  } else {
    adminDashboardController.getUserCount((errUser, userCount) => {
      if (errUser) {
          res.status(500).json(errUser);
          return;
      }

      adminDashboardController.getSubjectCount((errSubject, subjectCount) => {
          if (errSubject) {
              res.status(500).json(errSubject);
              return;
          }

          // Do something with both userCount and subjectCount values
          res.render('admin_dashboard', { userCount, subjectCount });
      });
  });
  }
});

router.get('/logout', authController.logout);

router.post('/login', authController.login);

module.exports = router;