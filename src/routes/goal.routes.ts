import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createGoal,
  getGoals,
  getMyGoals, // NEW: Import the new getMyGoals function
  getGoalById,
  getPublicGoals,
  updateGoal,
  deleteGoal,
  joinGoal,
  getJoinedGoals,
  searchPublicGoals,
} from "../controllers/goalController";

const router = Router();

// Utility function to handle async route handlers
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// IMPORTANT: More specific routes should come before more general ones
// to avoid route conflicts

// Search public goals - needs to be before /goals/public
router.get(
  "/goals/search",
  authenticate,
  asyncHandler(searchPublicGoals)
);

// Get public goals
router.get(
  "/goals/public",
  authenticate,
  asyncHandler(getPublicGoals)
);

// Get joined goals
router.get(
  "/goals/joined",
  authenticate,
  asyncHandler(getJoinedGoals)
);

// NEW: Get goals created by the authenticated user
router.get(
  "/goals/my",
  authenticate,
  asyncHandler(getMyGoals)
);

// Create a new goal
router.post(
  "/goals",
  authenticate,
  asyncHandler(createGoal)
);

// Get all goals (admin/general listing)
router.get(
  "/goals",
  authenticate,
  asyncHandler(getGoals)
);

// Join a specific goal
router.post(
  "/goals/:id/join",
  authenticate,
  asyncHandler(joinGoal)
);

// Get a specific goal by ID
router.get(
  "/goals/:id",
  authenticate,
  asyncHandler(getGoalById)
);

// Update a specific goal
router.put(
  "/goals/:id",
  authenticate,
  asyncHandler(updateGoal)
);

// Delete a specific goal
router.delete(
  "/goals/:id",
  authenticate,
  asyncHandler(deleteGoal)
);

export default router;
