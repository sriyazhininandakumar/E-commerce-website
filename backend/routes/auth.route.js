const express = require('express');
const { registerUser, signInUser} = require('../controllers/auth.controller');
const router = express.Router();


router.post('/signup', registerUser);



router.post('/signin', signInUser);

module.exports = router;