const express = require('express');
const { registro, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registro);
router.post('/login', login);

module.exports = router;