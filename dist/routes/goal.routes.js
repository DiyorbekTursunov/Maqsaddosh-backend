"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const goalController_1 = require("../controllers/goalController");
const router = (0, express_1.Router)();
// CRUD routes for goals (all protected by authentication)
router.post("/goals", auth_middleware_1.authenticate, (req, res, next) => {
    (0, goalController_1.createGoal)(req, res).catch(next);
});
router.get("/goals", auth_middleware_1.authenticate, (req, res, next) => {
    (0, goalController_1.getGoals)(req, res).catch(next);
});
router.get("/goals/public", auth_middleware_1.authenticate, (req, res, next) => {
    (0, goalController_1.getPublicGoals)(req, res).catch(next);
});
router.get("/goals/:id", auth_middleware_1.authenticate, (req, res, next) => {
    (0, goalController_1.getGoalById)(req, res).catch(next);
});
router.put("/goals/:id", auth_middleware_1.authenticate, (req, res, next) => {
    (0, goalController_1.updateGoal)(req, res).catch(next);
});
router.delete("/goals/:id", auth_middleware_1.authenticate, (req, res, next) => {
    (0, goalController_1.deleteGoal)(req, res).catch(next);
});
router.post("/goals/:id/join", auth_middleware_1.authenticate, (req, res, next) => {
    (0, goalController_1.joinGoal)(req, res).catch(next);
});
router.get("/goals/joined", auth_middleware_1.authenticate, (req, res, next) => {
    (0, goalController_1.getJoinedGoals)(req, res).catch(next);
});
router.get("/goals", (req, res, next) => {
    (0, goalController_1.searchPublicGoals)(req, res).catch(next);
});
exports.default = router;
