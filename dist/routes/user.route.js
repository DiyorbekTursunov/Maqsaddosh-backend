"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/signup', user_controller_1.signup);
router.post('/login', user_controller_1.login);
router.get('/google', user_controller_1.googleAuth);
router.get('/telegram', user_controller_1.telegramAuth);
// Protected routes
router.get('/me', auth_middleware_1.authenticate, user_controller_1.getCurrentUser);
router.patch('/me', auth_middleware_1.authenticate, user_controller_1.updateAccount);
exports.default = router;
