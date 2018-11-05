const express = require('../../node_modules/express');
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();


router.get('/', checkAuth, userController.users_list);
router.delete('/', checkAuth, userController.user_delete);
router.post('/register', userController.user_register);
router.post('/login', userController.user_login);

module.exports = router;
