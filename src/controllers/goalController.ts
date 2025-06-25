import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Types for better type safety
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const VALID_DURATIONS = [7, 14, 21, 28] as const;
const VALID_VISIBILITIES = ["PUBLIC", "PRIVATE"] as const;
const VALID_STATUSES = ["ACTIVE", "COMPLETED", "CANCELLED"] as const;

// Utility function for error responses
const sendErrorResponse = (res: Response, status: number, message: string, error?: string) => {
  return res.status(status).json({
    success: false,
    message,
    ...(error && { error })
  });
};

// Utility function for success responses
const sendSuccessResponse = (res: Response, status: number, data?: any, message?: string) => {
  return res.status(status).json({
    success: true,
    ...(data && { data }),
    ...(message && { message })
  });
};

// Create a goal
export const createGoal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      description,
      directionId: direction,
      subDirectionId: subDirection,
      duration,
      visibility,
      phone,
      telegram,
      endDate,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
    }

    // Validate required fields
    if (!name || !direction || !duration || !visibility || !phone || !telegram || !endDate) {
      return sendErrorResponse(res, 400, "Majburiy maydonlar to'ldirilmadi");
    }

    // Validate duration
    const durationNum = Number(duration);
    if (!VALID_DURATIONS.includes(durationNum as any)) {
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

    const goal = await prisma.goal.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
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
  } catch (error: any) {
    console.error("Error creating goal:", error);
    return sendErrorResponse(res, 500, "Maqsad yaratishda xatolik yuz berdi", error.message);
  }
};

// Get all goals (for admin or general listing)
export const getGoals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
    }

    const goals = await prisma.goal.findMany({
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
  } catch (error: any) {
    console.error("Error fetching goals:", error);
    return sendErrorResponse(res, 500, "Maqsadlarni olishda xatolik yuz berdi", error.message);
  }
};

// NEW: Get goals created by the authenticated user
export const getMyGoals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
    }

    // Optional query parameters for filtering
    const { status, visibility } = req.query;

    const whereClause: any = {
      creatorId: userId,
    };

    // Add status filter if provided
    if (status && VALID_STATUSES.includes(status as any)) {
      whereClause.status = status;
    }

    // Add visibility filter if provided
    if (visibility && VALID_VISIBILITIES.includes(visibility as any)) {
      whereClause.visibility = visibility;
    }

    const myGoals = await prisma.goal.findMany({
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
  } catch (error: any) {
    console.error("Error fetching my goals:", error);
    return sendErrorResponse(res, 500, "Mening maqsadlarimni olishda xatolik yuz berdi", error.message);
  }
};

// Get a single goal by ID
export const getGoalById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
    }

    const goal = await prisma.goal.findUnique({
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
  } catch (error: any) {
    console.error("Error fetching goal:", error);
    return sendErrorResponse(res, 500, "Maqsadni olishda xatolik yuz berdi", error.message);
  }
};

// Update a goal
export const updateGoal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      direction,
      subDirection,
      duration,
      visibility,
      phone,
      telegram,
      startDate,
      endDate,
      status,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
    }

    const goal = await prisma.goal.findUnique({ where: { id } });
    if (!goal) {
      return sendErrorResponse(res, 404, "Maqsad topilmadi");
    }

    if (goal.creatorId !== userId) {
      return sendErrorResponse(res, 403, "Bu maqsadni tahrirlash huquqingiz yo'q");
    }

    // Validate duration if provided
    if (duration && !VALID_DURATIONS.includes(Number(duration) as any)) {
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

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(direction && { direction }),
        ...(subDirection !== undefined && { subDirection }),
        ...(duration && { duration: Number(duration) }),
        ...(visibility && { visibility }),
        ...(phone && { phone: phone.trim() }),
        ...(telegram && { telegram: telegram.trim() }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(parsedEndDate && { endDate: parsedEndDate }),
        ...(status && { status }),
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
          }
        }
      }
    });

    return sendSuccessResponse(res, 200, updatedGoal);
  } catch (error: any) {
    console.error("Error updating goal:", error);
    return sendErrorResponse(res, 500, "Maqsadni yangilashda xatolik yuz berdi", error.message);
  }
};

// Delete a goal
export const deleteGoal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
    }

    const goal = await prisma.goal.findUnique({ where: { id } });
    if (!goal) {
      return sendErrorResponse(res, 404, "Maqsad topilmadi");
    }

    if (goal.creatorId !== userId) {
      return sendErrorResponse(res, 403, "Bu maqsadni o'chirish huquqingiz yo'q");
    }

    await prisma.goal.delete({ where: { id } });

    return sendSuccessResponse(res, 200, null, "Maqsad muvaffaqiyatli o'chirildi");
  } catch (error: any) {
    console.error("Error deleting goal:", error);
    return sendErrorResponse(res, 500, "Maqsadni o'chirishda xatolik yuz berdi", error.message);
  }
};

// Join a goal
export const joinGoal = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return sendErrorResponse(res, 404, "Foydalanuvchi topilmadi");
    }

    const goal = await prisma.goal.findUnique({
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

    const participant = await prisma.goalParticipant.create({
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
  } catch (error: any) {
    console.error("Error joining goal:", error);
    return sendErrorResponse(res, 500, "Maqsadga qo'shilishda xatolik yuz berdi", error.message);
  }
};

// Get all joined goals for the authenticated user
export const getJoinedGoals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendErrorResponse(res, 401, "Foydalanuvchi autentifikatsiyadan o'tmagan");
    }

    const joinedGoals = await prisma.goal.findMany({
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
  } catch (error: any) {
    console.error("Error fetching joined goals:", error);
    return sendErrorResponse(res, 500, "Qo'shilgan maqsadlarni olishda xatolik yuz berdi", error.message);
  }
};

// Get public goals
export const getPublicGoals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subDirection, status = "ACTIVE" } = req.query;

    const whereClause: any = {
      visibility: "PUBLIC",
      status: status || "ACTIVE",
    };

    if (subDirection && typeof subDirection === "string") {
      whereClause.subDirection = subDirection;
    }

    const goals = await prisma.goal.findMany({
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
  } catch (error: any) {
    console.error("Error fetching public goals:", error);
    return sendErrorResponse(res, 500, "Ommaviy maqsadlarni olishda xatolik yuz berdi", error.message);
  }
};

// Search public goals
export const searchPublicGoals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const searchTerm = req.query.q as string;

    if (!searchTerm || typeof searchTerm !== "string" || searchTerm.trim() === "") {
      return sendErrorResponse(res, 400, "Iltimos, qidiruv so'rovini kiriting.");
    }

    const sanitizedSearchTerm = searchTerm.trim();

    const goals = await prisma.goal.findMany({
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
  } catch (error: any) {
    console.error("Error searching goals:", error);
    return sendErrorResponse(res, 500, "Maqsadlarni qidirishda xatolik yuz berdi.", error.message);
  }
};
