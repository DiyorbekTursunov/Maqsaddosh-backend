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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPublicGoals = exports.getPublicGoals = exports.getJoinedGoals = exports.joinGoal = exports.deleteGoal = exports.updateGoal = exports.getGoalById = exports.getGoals = exports.createGoal = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a goal
const createGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, directionId: direction, // Map frontend's directionId to schema's direction
        subDirectionId: subDirection, // Map frontend's subDirectionId to schema's subDirection
        duration, visibility, phone, telegram, endDate, } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
            });
        }
        if (!name ||
            !direction ||
            !subDirection ||
            !duration ||
            !visibility ||
            !phone ||
            !telegram ||
            !endDate) {
            return res
                .status(400)
                .json({ success: false, message: "Majburiy maydonlar to'ldirilmadi" });
        }
        // Validate duration
        const durationNum = Number(duration);
        if (![7, 14, 21, 28].includes(durationNum)) {
            return res
                .status(400)
                .json({ success: false, message: "Noto'g'ri muddat tanlangan" });
        }
        // Validate visibility
        if (!["PUBLIC", "PRIVATE"].includes(visibility)) {
            return res
                .status(400)
                .json({ success: false, message: "Noto'g'ri ko'rinish turi" });
        }
        // Validate endDate format
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedEndDate.getTime())) {
            return res
                .status(400)
                .json({ success: false, message: "Noto'g'ri tugash sanasi formati" });
        }
        const goal = yield prisma.goal.create({
            data: {
                name,
                description: description || null,
                direction,
                subDirection: subDirection || null,
                duration: durationNum,
                visibility,
                phone,
                telegram,
                startDate: new Date(), // Explicitly set to current date
                endDate: parsedEndDate,
                creatorId: userId,
                status: "ACTIVE", // Default per schema
            },
        });
        res.status(201).json({ success: true, data: goal });
    }
    catch (error) {
        console.error("Error creating goal:", error);
        res.status(500).json({
            success: false,
            message: "Maqsad yaratishda xatolik yuz berdi",
            error: error.message,
        });
    }
});
exports.createGoal = createGoal;
// Get all goals for the authenticated user
const getGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
            });
        }
        const goals = yield prisma.goal.findMany({
            include: { creator: true, participants: true },
        });
        res.status(200).json({ success: true, data: goals });
    }
    catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({
            success: false,
            message: "Maqsadlarni olishda xatolik yuz berdi",
            error: error.message,
        });
    }
});
exports.getGoals = getGoals;
// Get a single goal by ID
const getGoalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("ishladi 1");
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
            });
        }
        const goal = yield prisma.goal.findUnique({
            where: { id },
            include: { creator: true, participants: true },
        });
        if (!goal) {
            return res
                .status(404)
                .json({ success: false, message: "Maqsad topilmadi" });
        }
        res.status(200).json({ success: true, data: goal });
    }
    catch (error) {
        console.error("Error fetching goal:", error);
        res.status(500).json({
            success: false,
            message: "Maqsadni olishda xatolik yuz berdi",
            error: error.message,
        });
    }
});
exports.getGoalById = getGoalById;
// Update a goal
const updateGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("ishladi 2");
    try {
        const { id } = req.params;
        const { name, description, direction, subDirection, duration, visibility, phone, telegram, startDate, endDate, status, } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
            });
        }
        const goal = yield prisma.goal.findUnique({ where: { id } });
        if (!goal) {
            return res
                .status(404)
                .json({ success: false, message: "Maqsad topilmadi" });
        }
        if (goal.creatorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Bu maqsadni tahrirlash huquqingiz yo'q",
            });
        }
        // Validate duration if provided
        if (duration && ![7, 14, 21, 28].includes(Number(duration))) {
            return res
                .status(400)
                .json({ success: false, message: "Noto'g'ri muddat tanlangan" });
        }
        // Validate visibility if provided
        if (visibility && !["PUBLIC", "PRIVATE"].includes(visibility)) {
            return res
                .status(400)
                .json({ success: false, message: "Noto'g'ri ko'rinish turi" });
        }
        // Validate status if provided
        if (status && !["ACTIVE", "COMPLETED", "CANCELLED"].includes(status)) {
            return res
                .status(400)
                .json({ success: false, message: "Noto'g'ri holat" });
        }
        // Validate endDate if provided
        let parsedEndDate;
        if (endDate) {
            parsedEndDate = new Date(endDate);
            if (isNaN(parsedEndDate.getTime())) {
                return res
                    .status(400)
                    .json({ success: false, message: "Noto'g'ri tugash sanasi formati" });
            }
        }
        const updatedGoal = yield prisma.goal.update({
            where: { id },
            data: {
                name: name || goal.name,
                description: description !== undefined ? description : goal.description,
                direction: direction || goal.direction,
                subDirection: subDirection !== undefined ? subDirection : goal.subDirection,
                duration: duration ? Number(duration) : goal.duration,
                visibility: visibility || goal.visibility,
                phone: phone || goal.phone,
                telegram: telegram || goal.telegram,
                startDate: startDate ? new Date(startDate) : goal.startDate,
                endDate: parsedEndDate || goal.endDate,
                status: status || goal.status,
            },
        });
        res.status(200).json({ success: true, data: updatedGoal });
    }
    catch (error) {
        console.error("Error updating goal:", error);
        res.status(500).json({
            success: false,
            message: "Maqsadni yangilashda xatolik yuz berdi",
            error: error.message,
        });
    }
});
exports.updateGoal = updateGoal;
// Delete a goal
const deleteGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("ishladi 3");
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
            });
        }
        const goal = yield prisma.goal.findUnique({ where: { id } });
        if (!goal) {
            return res
                .status(404)
                .json({ success: false, message: "Maqsad topilmadi" });
        }
        if (goal.creatorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Bu maqsadni o'chirish huquqingiz yo'q",
            });
        }
        yield prisma.goal.delete({ where: { id } });
        res
            .status(200)
            .json({ success: true, message: "Maqsad muvaffaqiyatli o'chirildi" });
    }
    catch (error) {
        console.error("Error deleting goal:", error);
        res.status(500).json({
            success: false,
            message: "Maqsadni o'chirishda xatolik yuz berdi",
            error: error.message,
        });
    }
});
exports.deleteGoal = deleteGoal;
// Join a goal
const joinGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("ishladi 4");
    try {
        const { id } = req.params; // Goal ID
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "Foydalanuvchi topilmadi" });
        }
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
            });
        }
        const goal = yield prisma.goal.findUnique({
            where: { id },
            include: { participants: true },
        });
        if (!goal) {
            return res
                .status(404)
                .json({ success: false, message: "Maqsad topilmadi" });
        }
        if (goal.visibility === "PRIVATE") {
            return res.status(403).json({
                success: false,
                message: "Shaxsiy maqsadga qo'shilish mumkin emas",
            });
        }
        if (goal.participants.some((participant) => participant.userId === userId)) {
            return res.status(400).json({
                success: false,
                message: "Foydalanuvchi allaqachon qo'shilgan",
            });
        }
        if (goal.creatorId === userId) {
            return res.status(400).json({
                success: false,
                message: "Yaratuvchi o'z maqsadiga qo'shila olmaydi",
            });
        }
        const participant = yield prisma.goalParticipant.create({
            data: {
                userId,
                goalId: id,
                role: "PARTICIPANT",
                avatar: user.avatar,
            },
        });
        res.status(201).json({
            success: true,
            message: "Maqsadga muvaffaqiyatli qo'shildingiz",
            data: participant,
        });
    }
    catch (error) {
        console.error("Error joining goal:", error);
        res.status(500).json({
            success: false,
            message: "Maqsadga qo'shilishda xatolik yuz berdi",
            error: error.message,
        });
    }
});
exports.joinGoal = joinGoal;
// Get all joined goals for the authenticated user
const getJoinedGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
            });
        }
        const joinedGoals = yield prisma.goal.findMany({
            where: {
                participants: {
                    some: { userId, role: { not: "REMOVED" } },
                },
            },
            include: { creator: true, participants: true },
        });
        res.status(200).json({ success: true, data: joinedGoals });
    }
    catch (error) {
        console.error("Error fetching joined goals:", error);
        res.status(500).json({
            success: false,
            message: "Qo'shilgan maqsadlarni olishda xatolik yuz berdi",
            error: error.message,
        });
    }
});
exports.getJoinedGoals = getJoinedGoals;
const getPublicGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subDirection } = req.query;
        if (!subDirection || typeof subDirection !== "string") {
            return res
                .status(400)
                .json({ success: false, message: "Ichki yo'nalish ko'rsatilmadi" });
        }
        const goals = yield prisma.goal.findMany({
            where: {
                visibility: "PUBLIC",
                subDirection: subDirection,
                status: "ACTIVE", // Only fetch active goals
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    },
                },
                participants: {
                    select: {
                        userId: true,
                        role: true,
                    },
                },
            },
        });
        res.status(200).json({ success: true, data: goals });
    }
    catch (error) {
        console.error("Error fetching public goals:", error);
        res.status(500).json({
            success: false,
            message: "Ommaviy maqsadlarni olishda xatolik yuz berdi",
            error: error.message,
        });
    }
});
exports.getPublicGoals = getPublicGoals;
// Search public goals
const searchPublicGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.q;
        // Validate input
        if (!searchTerm || typeof searchTerm !== "string" || searchTerm.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Iltimos, qidiruv so'rovini kiriting.",
            });
        }
        // Sanitize searchTerm to avoid unexpected behavior
        const sanitizedSearchTerm = searchTerm.trim();
        const goals = yield prisma.goal.findMany({
            where: {
                visibility: "PUBLIC", // Only search public goals
                status: "ACTIVE", // Only search active goals
                name: {
                    contains: sanitizedSearchTerm,
                    mode: "insensitive", // Case-insensitive search
                },
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    },
                },
                participants: {
                    select: {
                        userId: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (goals.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: `"${sanitizedSearchTerm}" uchun natija topilmadi.`,
            });
        }
        res.status(200).json({ success: true, data: goals });
    }
    catch (error) {
        console.error("Error searching goals:", error);
        res.status(500).json({
            success: false,
            message: "Maqsadlarni qidirishda xatolik yuz berdi.",
            error: error.message,
        });
    }
});
exports.searchPublicGoals = searchPublicGoals;
