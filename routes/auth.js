const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const restrictTo = require('../middlewares/auth_middleware');
const adminDashboardController = require('../controllers/adminDashboardController');
const change_password = require('../controllers/dashboardController');


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

router.post('/api/change_password', (req, res) => {
    const user_id = req.session.user.user_id;
    const { current_password, new_password, confirm_password } = req.body;

    // Call the change_password function and handle its response
    change_password.change_password(current_password, new_password, confirm_password, user_id, (error, message) => {
        if (error) {
            // If there was an error changing the password, return an error response
            return res.status(400).json({ error });
        }
        // Password changed successfully, return a success response
        res.status(200).json({ message });
    });
});

module.exports = router;