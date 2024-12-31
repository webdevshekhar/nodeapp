const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');
const middleware = require('../middlewares/index.middleware');

router.post('/admin/auth/register', controller.admin.register);
router.post('/admin/auth/login', controller.admin.login);
router.post('/admin/auth/refreshToken', controller.admin.refreshToken);

router.post('/user/auth/register', controller.user.register);
router.post('/user/auth/login', controller.user.login);
router.post('/user/auth/refreshToken', controller.user.refreshToken);

router.post('/user/getAllUsers', middleware.auth.protect, controller.user.getAllUsers);

module.exports = router;
