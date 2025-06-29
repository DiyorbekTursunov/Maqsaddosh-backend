"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const direction_routes_1 = __importDefault(require("./routes/direction.routes"));
const goal_routes_1 = __importDefault(require("./routes/goal.routes"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Allows all origins
app.use(express_1.default.json());
app.use("/api", direction_routes_1.default);
app.use("/api", goal_routes_1.default);
app.use("/api", user_route_1.default);
exports.default = app;
