const express = require('express');
const router = express.Router();
const {signup, login, signout, forgotPassword, resetPassword, refresh} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/signout', signout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/refresh', refresh);

module.exports = router;