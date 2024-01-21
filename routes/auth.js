const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const restrictTo = require('../middlewares/auth_middleware');


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
      res.render('admin_dashboard');
  }
});

router.get('/logout', authController.logout);

router.post('/login', authController.login);

module.exports = router;