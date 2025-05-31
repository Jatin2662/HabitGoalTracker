

const express = require('express');
const { ensureAuthorized, ensureAuthenticated } = require('../middlewares/UserAuthentication');
const { adminDashboardData } = require('../controllers/AdminController');
const router = express.Router();


router.get('/admin-dashboard', ensureAuthenticated, ensureAuthorized(['admin']), adminDashboardData )

module.exports = router;