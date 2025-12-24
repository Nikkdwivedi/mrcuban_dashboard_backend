import express from "express";
import {
  getCallHistory,
  getUserCalls,
  getCallDetails,
  checkCallAvailability,
  getCallStats
} from "../controllers/call_controller.js";

const router = express.Router();

// Get call history for an order
router.get("/call/history", getCallHistory);

// Get all calls for a user
router.get("/call/user", getUserCalls);

// Get call details by ID
router.get("/call/details", getCallDetails);

// Check if calling is available for an order
router.get("/call/availability", checkCallAvailability);

// Get call statistics for an order
router.get("/call/stats", getCallStats);

export default router;
