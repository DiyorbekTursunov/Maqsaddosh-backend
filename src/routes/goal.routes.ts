import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createGoal,
  getGoals,
  getGoalById, // Import getGoalById
  getPublicGoals,
  updateGoal,
  deleteGoal,
  joinGoal,
  getJoinedGoals,
  searchPublicGoals,
} from "../controllers/goalController";

const router = Router();

// CRUD routes for goals (all protected by authentication)
router.post(
  "/goals",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    createGoal(req, res).catch(next);
  }
);

router.get(
  "/goals",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    getGoals(req, res).catch(next);
  }
);

router.get(
  "/goals/public",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    getPublicGoals(req, res).catch(next);
  }
);

router.get(
  "/goals/:id",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    getGoalById(req, res).catch(next);
  }
);

router.put(
  "/goals/:id",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    updateGoal(req, res).catch(next);
  }
);

router.delete(
  "/goals/:id",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    deleteGoal(req, res).catch(next);
  }
);

router.post(
  "/goals/:id/join",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    joinGoal(req, res).catch(next);
  }
);

router.get(
  "/goals/joined",
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    getJoinedGoals(req, res).catch(next);
  }
);

router.get("/goals", (req: Request, res: Response, next: NextFunction) => {
  searchPublicGoals(req, res).catch(next)
})

export default router;
