

const express = require('express');
const { signup, login, verifyEmail, EmailVerification, getPasswordChangeRequest, resetPassword } = require('../controllers/UserAuthenticationController');
const { signupValidation, loginValidation, emailVerificationValidation, resetPasswordValidation } = require('../middlewares/AuthValidation');
const router = express.Router();


router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

router.get('/verify/:token', verifyEmail)
router.post('/verify', emailVerificationValidation, (req, res, next) => {
    req.body.linkName = 'verify';
    next();
}, EmailVerification )

router.post('/reset-password', emailVerificationValidation, (req, res, next) => {
    req.body.linkName = 'reset-password';
    next();
}, EmailVerification )
router.get('/reset-password/:token', getPasswordChangeRequest)
router.post('/reset-password/:token', resetPasswordValidation, resetPassword)

module.exports = router;