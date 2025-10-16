import express from "express";
import { getTRRatio } from "../controllers/get_tr_ratio.js"; // Added .js


const router = express.Router();

router.get("/tr-ratio/:id", getTRRatio);

export default router;