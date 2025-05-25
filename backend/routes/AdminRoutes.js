

const express = require('express');
const { ensureAuthorized, ensureAuthenticated } = require('../middlewares/UserAuthentication');
const router = express.Router();


router.get('/dashboard', ensureAuthenticated, ensureAuthorized(['admin']), (req, res)=>{
    res.json({ message: "Admin Dashboard" })
})

module.exports = router;