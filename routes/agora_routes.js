import express from "express";
import {
  generateAgoraToken,
  sendCallNotification,
} from "../controllers/agora_controller.js";

const router = express.Router();

// Generate Agora RTC token
router.get("/generate-token", generateAgoraToken);

// Send call notification
router.post("/send-call-notification", sendCallNotification);

export default router;
