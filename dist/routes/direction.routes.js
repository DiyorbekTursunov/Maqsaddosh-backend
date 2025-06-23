"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const directionController_1 = require("../controllers/direction/directionController");
const router = (0, express_1.Router)();
// Route to get all directions
router.get('/directions', (req, res, next) => {
    (0, directionController_1.getDirections)(req, res).catch(next);
});
// Route to get subdirections by direction ID
router.get('/directions/:id', (req, res, next) => {
    (0, directionController_1.getSubDirections)(req, res).catch(next);
});
;
exports.default = router;
