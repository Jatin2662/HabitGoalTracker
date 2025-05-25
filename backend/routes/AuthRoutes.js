

const express = require('express');
const { signup, login } = require('../controllers/UserAuthenticationController');
const { signupValidation, loginValidation } = require('../middlewares/AuthValidation');
const router = express.Router();


router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);


module.exports = router;