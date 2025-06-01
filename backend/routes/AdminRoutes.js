

const express = require('express');
const { ensureAuthorized, ensureAuthenticated } = require('../middlewares/UserAuthentication');
const { adminDashboardData, getAllUsers, notifySingleUser } = require('../controllers/AdminController');
const router = express.Router();


router.get('/admin-dashboard', ensureAuthenticated, ensureAuthorized(['admin']), adminDashboardData )
router.get('/admin-users', ensureAuthenticated, ensureAuthorized(['admin']), getAllUsers)
router.post('/admin-users', ensureAuthenticated, ensureAuthorized(['admin']), notifySingleUser)

module.exports = router;