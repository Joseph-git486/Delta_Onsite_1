const express = require('express');
const router = express.Router();
const {getConnections, getAllUsers} = require('../connections');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-connections', authMiddleware,getConnections);
router.get('/get-all-users', authMiddleware,getAllUsers);

module.exports = router;