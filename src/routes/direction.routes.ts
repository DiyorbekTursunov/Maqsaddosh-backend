import { Router, Request, Response, NextFunction } from "express";
import { getDirections, getSubDirections } from '../controllers/direction/directionController';

const router = Router();

// Route to get all directions
router.get('/directions', (req: Request, res: Response, next: NextFunction) => {
    getDirections(req,res).catch(next)
});

// Route to get subdirections by direction ID
router.get('/directions/:id', (req: Request, res: Response, next: NextFunction) => {
    getSubDirections(req,res).catch(next)
});;

export default router;
