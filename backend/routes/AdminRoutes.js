

const express = require('express');
const { ensureAuthorized, ensureAuthenticated } = require('../middlewares/UserAuthentication');
const { adminDashboardData, getAllUsers, notifySingleUser, setMailContent, getMailContent } = require('../controllers/AdminController');
const mailContentValidation = require('../middlewares/AdminFormValidation');
const router = express.Router();


router.get('/admin-dashboard', ensureAuthenticated, ensureAuthorized(['admin']), adminDashboardData )
router.get('/admin-users', ensureAuthenticated, ensureAuthorized(['admin']), getAllUsers)
router.post('/admin-users', ensureAuthenticated, ensureAuthorized(['admin']), notifySingleUser)
router.post('/admin-setCustomEmail', ensureAuthenticated, ensureAuthorized(['admin']), mailContentValidation, setMailContent)
router.put('/admin-setCustomEmail', ensureAuthenticated, ensureAuthorized(['admin']), mailContentValidation, setMailContent)
router.get('/admin-setCustomEmail', ensureAuthenticated, ensureAuthorized(['admin']), getMailContent)

module.exports = router;