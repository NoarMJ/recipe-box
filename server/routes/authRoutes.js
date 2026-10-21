
const express = require('express');

const { register, login , getMe, logout} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getMe' ,  getMe);
router.post('/logout', logout);

module.exports = router;
