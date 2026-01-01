import express from "express";
import {
  generateAgoraToken,
  sendCallNotification,
  sendCallRejection,
} from "../controllers/agora_controller.js";

const router = express.Router();

// Generate Agora RTC token
router.get("/generate-token", generateAgoraToken);

// Send call notification
router.post("/send-call-notification", sendCallNotification);

// Send call rejection notification
router.post("/reject-call", sendCallRejection);

export default router;
