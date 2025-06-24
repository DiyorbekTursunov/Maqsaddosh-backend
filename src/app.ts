import express, { Application, Request, Response, NextFunction } from "express";
import directionRoutes from "./routes/direction.routes";
import goalRoutes from "./routes/goal.routes";
import userRoutes from "./routes/user.route";
import cors from "cors";

const app: Application = express();

app.use(cors()); // Allows all origins

app.use(express.json());
app.use("/api", directionRoutes);
app.use("/api", goalRoutes);
app.use("/api", userRoutes);

export default app;
