import express from "express";
import { DistanceCalculator } from "../controllers/distance_controller.js";


const router = express.Router();

router.post("/distance",DistanceCalculator)

export default router;