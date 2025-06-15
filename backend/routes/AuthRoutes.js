

const express = require('express');
const { signup, login, verifyEmail, EmailVerification } = require('../controllers/UserAuthenticationController');
const { signupValidation, loginValidation } = require('../middlewares/AuthValidation');
const router = express.Router();


router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/verify/:token', verifyEmail)
router.post('/verify', EmailVerification )

module.exports = router;