const express = require('express');
const router = express.Router();
const restrictTo = require('../middlewares/auth_middleware');
const userListController = require('../controllers/userListController');
const adminSubjectListController = require('../controllers/adminSubjectListController');
const create_userController = require('../controllers/create_userController');
const create_subjectController = require('../controllers/create_subjectController');


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


router.post('/validation', (req, res) => {
  const { username, fullname, email, contact, address } = req.body;

  
  // Validate form inputs
  const usernameError = create_userController.validateUsername(username);
  const fullnameError = create_userController.validateFullName(fullname);
  const emailError = create_userController.validateEmail(email);
  const addressError = create_userController.validateaddress(address);
  const contactError = create_userController.validateContact(contact);

  // Package validation errors into a single JSON object
  res.json({ usernameError: usernameError, fullnameError: fullnameError,  emailError: emailError, addressError: addressError, contactError: contactError});

});

router.post('/userexist', (req, res) =>{
  const { username } = req.body;
  
  // Call checkUsernameExists with a callback function
  create_userController.checkUsernameExists(username, (error, userExist) => {
      if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      // Respond with the result of the username existence check
      res.json({ userExist: userExist });
  });
});

router.post('/register', (req, res) => {
  const { username, fullname, email, contact, address, role } = req.body;
  create_userController.registerUser(username, fullname, email, address, contact, role);
  res.status(200).json({ message: 'User registered successfully' });
});


router.get('/api/instructorList', async (req, res) => {
  try {
    const instructorList = await create_subjectController.getInstructorList();
    res.json({ instructorList });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/validateSubjectName', (req, res) => {
  const { subName } = req.body;
  const subNameValid = create_subjectController.validateSubjectName(subName);


  res.json(subNameValid);

});

router.post('/createSubject', (req, res) => {
  const { subName, selectedValue } = req.body;

  create_subjectController.createSubject(subName, selectedValue);

  res.status(200).json({ message: 'Subject created successfully' });
});

module.exports = router;