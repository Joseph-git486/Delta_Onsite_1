const express = require('express');
const router = express.Router();
const {getConnections, getAllUsers, createConnection} = require('../connections');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-connections/:id', authMiddleware,getConnections);
router.get('/get-all-users', authMiddleware,getAllUsers);
router.get('/create', authMiddleware,createConnection);

module.exports = router;