

const express = require('express');
const { ensureAuthenticated, ensureAuthorized } = require('../middlewares/UserAuthentication');
const { habitValidation, updateHabitValidation, userSettingsValidation } = require('../middlewares/UserHabitValidation');
const { addHabit, getHabits, updateHabit, deleteHabit, getUserSettings, updateUserSettings, getDashboardData, getHabitLogs, updateHabitLogCompletion } = require('../controllers/UserHabitController');
const router = express.Router();

router.post('/user-habits', ensureAuthenticated, ensureAuthorized(['admin', 'user']), habitValidation , addHabit)
router.get('/user-habits', ensureAuthenticated, ensureAuthorized(['admin', 'user']), habitValidation , getHabits)
router.patch('/user-habits/:habitId', ensureAuthenticated, ensureAuthorized(['admin', 'user']), updateHabitValidation , updateHabit)
router.delete('/user-habits/:habitId', ensureAuthenticated, ensureAuthorized(['admin', 'user']), deleteHabit)
// router.put('/user-habits/:habitId?', ensureAuthenticated, ensureAuthorized(['admin', 'user']), habitValidation , updateHabit)
router.get('/user-settings', ensureAuthenticated, ensureAuthorized(['admin', 'user']), getUserSettings)
router.post('/user-settings', ensureAuthenticated, ensureAuthorized(['admin', 'user']), userSettingsValidation, updateUserSettings)
router.get('/user-dashboard', ensureAuthenticated, ensureAuthorized(['admin', 'user']), getDashboardData)
router.get('/user-track', ensureAuthenticated, ensureAuthorized(['admin', 'user']), getHabitLogs)
router.patch('/user-track', ensureAuthenticated, ensureAuthorized(['admin', 'user']), updateHabitLogCompletion)

module.exports = router;