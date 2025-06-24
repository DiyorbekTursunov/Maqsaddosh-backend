"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.googleAuth = googleAuth;
exports.telegramAuth = telegramAuth;
exports.getCurrentUser = getCurrentUser;
exports.updateAccount = updateAccount;
const userService = __importStar(require("../services/user.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, fullName } = req.body;
        if (!email || !password || !fullName) {
            res.status(400).json({ success: false, error: 'Email, password, and fullName are required' });
            return;
        }
        try {
            const user = yield userService.createUser(email, password, fullName);
            const token = userService.generateToken(user);
            res.status(201).json({ success: true, token });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Email and password are required' });
            return;
        }
        try {
            const user = yield userService.verifyUser(email, password);
            if (!user) {
                res.status(401).json({ success: false, error: 'Invalid credentials' });
                return;
            }
            const token = userService.generateToken(user);
            res.json({ success: true, token });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
}
function googleAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code } = req.query;
        if (!code) {
            res.status(400).json({ success: false, error: 'Authorization code is required' });
            return;
        }
        try {
            const payload = yield userService.exchangeGoogleCode(code);
            const user = yield userService.findOrCreateGoogleUser(payload);
            const token = userService.generateToken(user);
            res.redirect(`https://maqsaddosh-website.vercel.app/?token=${token}`);
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
}
function telegramAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.query;
        if (!id || !auth_date || !hash) {
            res.status(400).json({ success: false, error: 'Missing required Telegram data' });
            return;
        }
        try {
            const isValid = yield userService.verifyTelegramData({
                id,
                first_name,
                last_name,
                username,
                photo_url,
                auth_date: parseInt(auth_date),
                hash,
            });
            if (!isValid) {
                res.status(401).json({ success: false, error: 'Invalid Telegram data' });
                return;
            }
            const user = yield userService.findOrCreateTelegramUser({
                id,
                first_name,
                last_name,
                username,
            });
            const token = userService.generateToken(user);
            res.redirect(`https://maqsaddosh-website.vercel.app/telegram-signin-test.html?token=${token}`);
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
}
function getCurrentUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        try {
            const user = yield userService.findUserById(userId);
            if (!user) {
                res.status(404).json({ success: false, error: 'User not found' });
                return;
            }
            res.json({ success: true, data: user });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
}
function updateAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { fullName, email, password, avatar } = req.body;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        if (!fullName && !email && !password && avatar === undefined) {
            res.status(400).json({ success: false, error: 'At least one field (fullName, email, password, avatar) is required' });
            return;
        }
        try {
            const data = {};
            if (fullName) {
                data.fullName = fullName;
            }
            if (email) {
                const existingUser = yield userService.findUserByEmail(email);
                if (existingUser && existingUser.id !== userId) {
                    res.status(400).json({ success: false, error: 'Email already in use' });
                    return;
                }
                data.email = email;
            }
            if (password) {
                if (password.length < 8) {
                    res.status(400).json({ success: false, error: 'Password must be at least 8 characters long' });
                    return;
                }
                data.password = yield bcrypt_1.default.hash(password, 10);
            }
            if (avatar !== undefined) {
                data.avatar = avatar; // Allow null to clear avatar
            }
            const updatedUser = yield userService.updateUser(userId, data);
            if (!updatedUser) {
                res.status(404).json({ success: false, error: 'User not found' });
                return;
            }
            res.json({ success: true, data: { id: updatedUser.id, email: updatedUser.email, fullName: updatedUser.fullName, avatar: updatedUser.avatar } });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
}
