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
exports.searchPublicGoals = exports.getPublicGoals = exports.getJoinedGoals = exports.joinGoal = exports.deleteGoal = exports.updateGoal = exports.getGoalById = exports.getMyGoals = exports.getGoals = exports.createGoal = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const VALID_DURATIONS = [7, 14, 21, 28];
const VALID_VISIBILITIES = ["PUBLIC", "PRIVATE"];
const VALID_STATUSES = ["ACTIVE", "COMPLETED", "CANCELLED"];
// Utility function for error responses
const sendErrorResponse = (res, status, message, error) => {
    return res.status(status).json(Object.assign({ success: false, message }, (error && { error })));
};
// Utility function for success responses
const sendSuccessResponse = (res, status, data, message) => {
    return res.status(status).json(Object.assign(Object.assign({ success: true }, (data && { data })), (message && { message })));
};
// Create a goal
const createGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, directionId: direction, subDirectionId: subDirection, duration, visibility, phone, telegram, endDate, } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
        }
        // Validate required fields
        if (!name || !direction || !duration || !visibility || !phone || !telegram || !endDate) {
            return sendErrorResponse(res, 400, "Majburiy maydonlar to'ldirilmadi");
        }
        // Validate duration
        const durationNum = Number(duration);
        if (!VALID_DURATIONS.includes(durationNum)) {
            return sendErrorResponse(res, 400, "Noto'g'ri muddat tanlangan");
        }
        // Validate visibility
        if (!VALID_VISIBILITIES.includes(visibility)) {
            return sendErrorResponse(res, 400, "Noto'g'ri ko'rinish turi");
        }
        // Validate endDate format
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedEndDate.getTime())) {
            return sendErrorResponse(res, 400, "Noto'g'ri tugash sanasi formati");
        }
        const goal = yield prisma.goal.create({
            data: {
                name: name.trim(),
                description: (description === null || description === void 0 ? void 0 : description.trim()) || null,
                direction,
                subDirection: subDirection || null,
                duration: durationNum,
                visibility,
                phone: phone.trim(),
                telegram: telegram.trim(),
                startDate: new Date(),
                endDate: parsedEndDate,
                creatorId: userId,
                status: "ACTIVE",
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    }
                }
            }
        });
        return sendSuccessResponse(res, 201, goal);
    }
    catch (error) {
        console.error("Error creating goal:", error);
        return sendErrorResponse(res, 500, "Maqsad yaratishda xatolik yuz berdi", error.message);
    }
});
exports.createGoal = createGoal;
// Get all goals (for admin or general listing)
const getGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
        }
        const goals = yield prisma.goal.findMany({
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        avatar: true,
                        joinedAt: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return sendSuccessResponse(res, 200, goals);
    }
    catch (error) {
        console.error("Error fetching goals:", error);
        return sendErrorResponse(res, 500, "Maqsadlarni olishda xatolik yuz berdi", error.message);
    }
});
exports.getGoals = getGoals;
// NEW: Get goals created by the authenticated user
const getMyGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
        }
        // Optional query parameters for filtering
        const { status, visibility } = req.query;
        const whereClause = {
            creatorId: userId,
        };
        // Add status filter if provided
        if (status && VALID_STATUSES.includes(status)) {
            whereClause.status = status;
        }
        // Add visibility filter if provided
        if (visibility && VALID_VISIBILITIES.includes(visibility)) {
            whereClause.visibility = visibility;
        }
        const myGoals = yield prisma.goal.findMany({
            where: whereClause,
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        avatar: true,
                        joinedAt: true,
                        user: {
                            select: {
                                fullName: true,
                                avatar: true,
                            }
                        }
                    },
                    where: {
                        role: { not: "REMOVED" }
                    }
                },
                _count: {
                    select: {
                        participants: {
                            where: {
                                role: { not: "REMOVED" }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return sendSuccessResponse(res, 200, myGoals);
    }
    catch (error) {
        console.error("Error fetching my goals:", error);
        return sendErrorResponse(res, 500, "Mening maqsadlarimni olishda xatolik yuz berdi", error.message);
    }
});
exports.getMyGoals = getMyGoals;
// Get a single goal by ID
const getGoalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
        }
        const goal = yield prisma.goal.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        avatar: true,
                        joinedAt: true,
                        user: {
                            select: {
                                fullName: true,
                                avatar: true,
                            }
                        }
                    },
                    where: {
                        role: { not: "REMOVED" }
                    }
                }
            },
        });
        if (!goal) {
            return sendErrorResponse(res, 404, "Maqsad topilmadi");
        }
        // Check if user has access to view this goal
        const isCreator = goal.creatorId === userId;
        const isParticipant = goal.participants.some(p => p.userId === userId);
        const isPublic = goal.visibility === "PUBLIC";
        if (!isCreator && !isParticipant && !isPublic) {
            return sendErrorResponse(res, 403, "Bu maqsadni ko'rish huquqingiz yo'q");
        }
        return sendSuccessResponse(res, 200, goal);
    }
    catch (error) {
        console.error("Error fetching goal:", error);
        return sendErrorResponse(res, 500, "Maqsadni olishda xatolik yuz berdi", error.message);
    }
});
exports.getGoalById = getGoalById;
// Update a goal
const updateGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { name, description, direction, subDirection, duration, visibility, phone, telegram, startDate, endDate, status, } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
        }
        const goal = yield prisma.goal.findUnique({ where: { id } });
        if (!goal) {
            return sendErrorResponse(res, 404, "Maqsad topilmadi");
        }
        if (goal.creatorId !== userId) {
            return sendErrorResponse(res, 403, "Bu maqsadni tahrirlash huquqingiz yo'q");
        }
        // Validate duration if provided
        if (duration && !VALID_DURATIONS.includes(Number(duration))) {
            return sendErrorResponse(res, 400, "Noto'g'ri muddat tanlangan");
        }
        // Validate visibility if provided
        if (visibility && !VALID_VISIBILITIES.includes(visibility)) {
            return sendErrorResponse(res, 400, "Noto'g'ri ko'rinish turi");
        }
        // Validate status if provided
        if (status && !VALID_STATUSES.includes(status)) {
            return sendErrorResponse(res, 400, "Noto'g'ri holat");
        }
        // Validate endDate if provided
        let parsedEndDate;
        if (endDate) {
            parsedEndDate = new Date(endDate);
            if (isNaN(parsedEndDate.getTime())) {
                return sendErrorResponse(res, 400, "Noto'g'ri tugash sanasi formati");
            }
        }
        const updatedGoal = yield prisma.goal.update({
            where: { id },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name: name.trim() })), (description !== undefined && { description: (description === null || description === void 0 ? void 0 : description.trim()) || null })), (direction && { direction })), (subDirection !== undefined && { subDirection })), (duration && { duration: Number(duration) })), (visibility && { visibility })), (phone && { phone: phone.trim() })), (telegram && { telegram: telegram.trim() })), (startDate && { startDate: new Date(startDate) })), (parsedEndDate && { endDate: parsedEndDate })), (status && { status })),
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        avatar: true,
                        joinedAt: true,
                    }
                }
            }
        });
        return sendSuccessResponse(res, 200, updatedGoal);
    }
    catch (error) {
        console.error("Error updating goal:", error);
        return sendErrorResponse(res, 500, "Maqsadni yangilashda xatolik yuz berdi", error.message);
    }
});
exports.updateGoal = updateGoal;
// Delete a goal
const deleteGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
        }
        const goal = yield prisma.goal.findUnique({ where: { id } });
        if (!goal) {
            return sendErrorResponse(res, 404, "Maqsad topilmadi");
        }
        if (goal.creatorId !== userId) {
            return sendErrorResponse(res, 403, "Bu maqsadni o'chirish huquqingiz yo'q");
        }
        yield prisma.goal.delete({ where: { id } });
        return sendSuccessResponse(res, 200, null, "Maqsad muvaffaqiyatli o'chirildi");
    }
    catch (error) {
        console.error("Error deleting goal:", error);
        return sendErrorResponse(res, 500, "Maqsadni o'chirishda xatolik yuz berdi", error.message);
    }
});
exports.deleteGoal = deleteGoal;
// Join a goal
const joinGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
        }
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return sendErrorResponse(res, 404, "Foydalanuvchi topilmadi");
        }
        const goal = yield prisma.goal.findUnique({
            where: { id },
            include: { participants: true },
        });
        if (!goal) {
            return sendErrorResponse(res, 404, "Maqsad topilmadi");
        }
        if (goal.visibility === "PRIVATE") {
            return sendErrorResponse(res, 403, "Shaxsiy maqsadga qo'shilish mumkin emas");
        }
        if (goal.status !== "ACTIVE") {
            return sendErrorResponse(res, 400, "Faol bo'lmagan maqsadga qo'shilish mumkin emas");
        }
        if (goal.participants.some((participant) => participant.userId === userId && participant.role !== "REMOVED")) {
            return sendErrorResponse(res, 400, "Foydalanuvchi allaqachon qo'shilgan");
        }
        if (goal.creatorId === userId) {
            return sendErrorResponse(res, 400, "Yaratuvchi o'z maqsadiga qo'shila olmaydi");
        }
        const participant = yield prisma.goalParticipant.create({
            data: {
                userId,
                goalId: id,
                role: "PARTICIPANT",
                avatar: user.avatar,
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        avatar: true,
                    }
                }
            }
        });
        return sendSuccessResponse(res, 201, participant, "Maqsadga muvaffaqiyatli qo'shildingiz");
    }
    catch (error) {
        console.error("Error joining goal:", error);
        return sendErrorResponse(res, 500, "Maqsadga qo'shilishda xatolik yuz berdi", error.message);
    }
});
exports.joinGoal = joinGoal;
// Get all joined goals for the authenticated user
const getJoinedGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
        }
        const joinedGoals = yield prisma.goal.findMany({
            where: {
                participants: {
                    some: {
                        userId,
                        role: { not: "REMOVED" }
                    },
                },
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        avatar: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        avatar: true,
                        joinedAt: true,
                        user: {
                            select: {
                                fullName: true,
                                avatar: true,
                            }
                        }
                    },
                    where: {
                        role: { not: "REMOVED" }
                    }
                },
                _count: {
                    select: {
                        participants: {
                            where: {
                                role: { not: "REMOVED" }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return sendSuccessResponse(res, 200, joinedGoals);
    }
    catch (error) {
        console.error("Error fetching joined goals:", error);
        return sendErrorResponse(res, 500, "Qo'shilgan maqsadlarni olishda xatolik yuz berdi", error.message);
    }
});
exports.getJoinedGoals = getJoinedGoals;
// Get public goals
const getPublicGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subDirection, status = "ACTIVE" } = req.query;
        const whereClause = {
            visibility: "PUBLIC",
            status: status || "ACTIVE",
        };
        if (subDirection && typeof subDirection === "string") {
            whereClause.subDirection = subDirection;
        }
        const goals = yield prisma.goal.findMany({
            where: whereClause,
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
                        avatar: true,
                        user: {
                            select: {
                                fullName: true,
                                avatar: true,
                            }
                        }
                    },
                    where: {
                        role: { not: "REMOVED" }
                    }
                },
                _count: {
                    select: {
                        participants: {
                            where: {
                                role: { not: "REMOVED" }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return sendSuccessResponse(res, 200, goals);
    }
    catch (error) {
        console.error("Error fetching public goals:", error);
        return sendErrorResponse(res, 500, "Ommaviy maqsadlarni olishda xatolik yuz berdi", error.message);
    }
});
exports.getPublicGoals = getPublicGoals;
// Search public goals
const searchPublicGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm || typeof searchTerm !== "string" || searchTerm.trim() === "") {
            return sendErrorResponse(res, 400, "Iltimos, qidiruv so'rovini kiriting.");
        }
        const sanitizedSearchTerm = searchTerm.trim();
        const goals = yield prisma.goal.findMany({
            where: {
                visibility: "PUBLIC",
                status: "ACTIVE",
                name: {
                    contains: sanitizedSearchTerm,
                    mode: "insensitive",
                },
            },
            include: {
                creator: { select: { id: true, fullName: true, avatar: true } },
                participants: { select: { userId: true, role: true, avatar: true, user: { select: { fullName: true, avatar: true } } }, where: { role: { not: "REMOVED" } } },
                _count: { select: { participants: { where: { role: { not: "REMOVED" } } } } }
            },
            orderBy: { createdAt: "desc" },
        });
        if (goals.length === 0) {
            return sendSuccessResponse(res, 200, [], `"${sanitizedSearchTerm}" uchun natija topilmadi.`);
        }
        return sendSuccessResponse(res, 200, goals);
    }
    catch (error) {
        console.error("Error searching goals:", error);
        return sendErrorResponse(res, 500, "Maqsadlarni qidirishda xatolik yuz berdi.", error.message);
    }
});
exports.searchPublicGoals = searchPublicGoals;
