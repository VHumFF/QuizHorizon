const express = require('express');
const router = express.Router();
const restrictTo = require('../middlewares/auth_middleware');
const userListController = require('../controllers/userListController');


router.get('/user_list', restrictTo('admin'), (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('user_list');
    }
});

router.get('/api/user-details', async (req, res) => {
    try {
      const user = await userListController.getUserDetails();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/users/:userId', userListController.deleteUser);

module.exports = router;