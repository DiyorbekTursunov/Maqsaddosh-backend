"use strict";
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
exports.createUser = createUser;
exports.verifyUser = verifyUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.updateUser = updateUser;
exports.exchangeGoogleCode = exchangeGoogleCode;
exports.findOrCreateGoogleUser = findOrCreateGoogleUser;
exports.generateToken = generateToken;
exports.verifyTelegramData = verifyTelegramData;
exports.findOrCreateTelegramUser = findOrCreateTelegramUser;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
const client = new google_auth_library_1.OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'https://maqsaddosh-backend-o2af.onrender.com/api/google',
});
function createUser(email, password, fullName) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield findUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        return prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            },
        });
    });
}
function verifyUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield findUserByEmail(email);
        if (!user || !user.password) {
            return null;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    });
}
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.user.findUnique({
            where: { email },
        });
    });
}
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, fullName: true, googleId: true, telegramId: true, avatar: true },
        });
    });
}
function updateUser(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.user.update({
            where: { id },
            data,
            select: { id: true, email: true, fullName: true, avatar: true },
        });
    });
}
function exchangeGoogleCode(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tokens } = yield client.getToken({
            code,
            redirect_uri: 'https://maqsaddosh-backend-o2af.onrender.com/api/google',
        });
        const ticket = yield client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error('Invalid Google token');
        }
        return payload;
    });
}
function findOrCreateGoogleUser(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = payload.email;
        const googleId = payload.sub;
        const avatar = payload.picture; // Google profile picture URL
        let user = yield prisma.user.findUnique({
            where: { email },
        });
        if (user) {
            if (!user.googleId || !user.avatar) {
                user = yield prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, avatar },
                });
            }
        }
        else {
            user = yield prisma.user.create({
                data: {
                    email,
                    googleId,
                    fullName: payload.name,
                    avatar,
                },
            });
        }
        return user;
    });
}
function generateToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key');
}
function verifyTelegramData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const dataCheckString = Object.keys(data)
            .filter((key) => key !== 'hash')
            .sort()
            .map((key) => `${key}=${data[key]}`)
            .join('\n');
        const secretKey = crypto_1.default.createHash('sha256').update(botToken).digest();
        const hmac = crypto_1.default.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
        return hmac === data.hash && Date.now() / 1000 - data.auth_date < 86400;
    });
}
function findOrCreateTelegramUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const telegramId = data.id;
        let user = yield prisma.user.findUnique({
            where: { telegramId },
        });
        if (!user && data.email) {
            user = yield prisma.user.findUnique({
                where: { email: data.email },
            });
            if (user) {
                user = yield prisma.user.update({
                    where: { id: user.id },
                    data: { telegramId },
                });
            }
        }
        if (!user) {
            user = yield prisma.user.create({
                data: {
                    email: data.email || `${telegramId}@telegram.placeholder`,
                    telegramId,
                    fullName: (_a = ([data.first_name, data.last_name].filter(Boolean).join(' ') || data.username)) !== null && _a !== void 0 ? _a : 'Telegram User',
                },
            });
        }
        return user;
    });
}
