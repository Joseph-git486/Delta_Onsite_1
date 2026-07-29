const express = require('express');
const router = express.Router();
const {signup, login, signout,refresh} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/signout', signout);
router.get('/refresh', refresh);

module.exports = router;