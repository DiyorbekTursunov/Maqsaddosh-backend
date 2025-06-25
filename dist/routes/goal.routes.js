"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const goalController_1 = require("../controllers/goalController");
const router = (0, express_1.Router)();
// Utility function to handle async route handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// IMPORTANT: More specific routes should come before more general ones
// to avoid route conflicts
// Search public goals - needs to be before /goals/public
router.get("/goals/search", auth_middleware_1.authenticate, asyncHandler(goalController_1.searchPublicGoals));
// Get public goals
router.get("/goals/public", auth_middleware_1.authenticate, asyncHandler(goalController_1.getPublicGoals));
// Get joined goals
router.get("/goals/joined", auth_middleware_1.authenticate, asyncHandler(goalController_1.getJoinedGoals));
// NEW: Get goals created by the authenticated user
router.get("/goals/my", auth_middleware_1.authenticate, asyncHandler(goalController_1.getMyGoals));
// Create a new goal
router.post("/goals", auth_middleware_1.authenticate, asyncHandler(goalController_1.createGoal));
// Get all goals (admin/general listing)
router.get("/goals", auth_middleware_1.authenticate, asyncHandler(goalController_1.getGoals));
// Join a specific goal
router.post("/goals/:id/join", auth_middleware_1.authenticate, asyncHandler(goalController_1.joinGoal));
// Get a specific goal by ID
router.get("/goals/:id", auth_middleware_1.authenticate, asyncHandler(goalController_1.getGoalById));
// Update a specific goal
router.put("/goals/:id", auth_middleware_1.authenticate, asyncHandler(goalController_1.updateGoal));
// Delete a specific goal
router.delete("/goals/:id", auth_middleware_1.authenticate, asyncHandler(goalController_1.deleteGoal));
exports.default = router;
