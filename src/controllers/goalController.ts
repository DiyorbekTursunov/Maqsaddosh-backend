import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a goal
export const createGoal = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      directionId: direction, // Map frontend's directionId to schema's direction
      subDirectionId: subDirection, // Map frontend's subDirectionId to schema's subDirection
      duration,
      visibility,
      phone,
      telegram,
      endDate,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
        });
    }

    if (
      !name ||
      !direction ||
      !subDirection ||
      !duration ||
      !visibility ||
      !phone ||
      !telegram ||
      !endDate
    ) {
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

    const goal = await prisma.goal.create({
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
  } catch (error: any) {
    console.error("Error creating goal:", error);
    res.status(500).json({
      success: false,
      message: "Maqsad yaratishda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Get all goals for the authenticated user
export const getGoals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
        });
    }

    const goals = await prisma.goal.findMany({
      include: { creator: true, participants: true },
    });

    res.status(200).json({ success: true, data: goals });
  } catch (error: any) {
    console.error("Error fetching goals:", error);
    res.status(500).json({
      success: false,
      message: "Maqsadlarni olishda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Get a single goal by ID
export const getGoalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
        });
    }

    const goal = await prisma.goal.findUnique({
      where: { id },
      include: { creator: true, participants: true },
    });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Maqsad topilmadi" });
    }

    res.status(200).json({ success: true, data: goal });
  } catch (error: any) {
    console.error("Error fetching goal:", error);
    res.status(500).json({
      success: false,
      message: "Maqsadni olishda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Update a goal
export const updateGoal = async (req: Request, res: Response) => {
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
      return res
        .status(401)
        .json({
          success: false,
          message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
        });
    }

    const goal = await prisma.goal.findUnique({ where: { id } });
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

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        name: name || goal.name,
        description: description !== undefined ? description : goal.description,
        direction: direction || goal.direction,
        subDirection:
          subDirection !== undefined ? subDirection : goal.subDirection,
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
  } catch (error: any) {
    console.error("Error updating goal:", error);
    res.status(500).json({
      success: false,
      message: "Maqsadni yangilashda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Delete a goal
export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
        });
    }

    const goal = await prisma.goal.findUnique({ where: { id } });
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

    await prisma.goal.delete({ where: { id } });

    res
      .status(200)
      .json({ success: true, message: "Maqsad muvaffaqiyatli o'chirildi" });
  } catch (error: any) {
    console.error("Error deleting goal:", error);
    res.status(500).json({
      success: false,
      message: "Maqsadni o'chirishda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Join a goal
export const joinGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Goal ID
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
        });
    }

    const goal = await prisma.goal.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Maqsad topilmadi" });
    }

    if (goal.visibility === "PRIVATE") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Shaxsiy maqsadga qo'shilish mumkin emas",
        });
    }

    if (
      goal.participants.some((participant) => participant.userId === userId)
    ) {
      return res
        .status(400)
        .json({
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

    const participant = await prisma.goalParticipant.create({
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
  } catch (error: any) {
    console.error("Error joining goal:", error);
    res.status(500).json({
      success: false,
      message: "Maqsadga qo'shilishda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Get all joined goals for the authenticated user
export const getJoinedGoals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Foydalanuvchi autentifikatsiyadan o'tmagan",
        });
    }

    const joinedGoals = await prisma.goal.findMany({
      where: {
        participants: {
          some: { userId, role: { not: "REMOVED" } },
        },
      },
      include: { creator: true, participants: true },
    });

    res.status(200).json({ success: true, data: joinedGoals });
  } catch (error: any) {
    console.error("Error fetching joined goals:", error);
    res.status(500).json({
      success: false,
      message: "Qo'shilgan maqsadlarni olishda xatolik yuz berdi",
      error: error.message,
    });
  }
};

export const getPublicGoals = async (req: Request, res: Response) => {
  try {
    const { subDirection } = req.query;

    if (!subDirection || typeof subDirection !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Ichki yo'nalish ko'rsatilmadi" });
    }

    const goals = await prisma.goal.findMany({
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
  } catch (error: any) {
    console.error("Error fetching public goals:", error);
    res.status(500).json({
      success: false,
      message: "Ommaviy maqsadlarni olishda xatolik yuz berdi",
      error: error.message,
    });
  }
};


// Search public goals
export const searchPublicGoals = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string

    if (!searchTerm || typeof searchTerm !== "string" || searchTerm.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Iltimos, qidiruv so'rovini kiriting.",
      })
    }

    const goals = await prisma.goal.findMany({
      where: {
        visibility: "PUBLIC", // Only search public goals
        status: "ACTIVE", // Only search active goals
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
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
    })

    if (goals.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: `"${searchTerm}" uchun natija topilmadi.`,
      })
    }

    res.status(200).json({ success: true, data: goals })
  } catch (error: any) {
    console.error("Error searching goals:", error)
    res.status(500).json({
      success: false,
      message: "Maqsadlarni qidirishda xatolik yuz berdi.",
      error: error.message,
    })
  }
}
