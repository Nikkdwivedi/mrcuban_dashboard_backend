import express from "express";
import {
  AcceptOrderLead,
  AcceptOrderLeadByCustomer,
  CancelRideByUser,
  CancelRideByUserAfterAccept,
  CheckRideStatus,
  CreateLead,
  DisplayCustomerLead,
  DisplayOrderLeads,
  DisplayRides,
  FinishRide,
  StartRide,
  NegotiationOrderLead
} from "../controllers/lead_controller.js";

const router = express.Router();

router.post("/create/lead", CreateLead);
router.post("/create/negotiation", NegotiationOrderLead);
router.get("/leads", DisplayOrderLeads);
router.post("/accept/lead/driver", AcceptOrderLead);
router.post("/accept/lead/customer", AcceptOrderLeadByCustomer);
router.get("/cancel/lead/customer", CancelRideByUser);
router.get("/cancel/lead/customer/after", CancelRideByUserAfterAccept);
router.get("/get/lead", DisplayCustomerLead);
router.get("/get/lead/drivers", DisplayRides);
router.get("/start/ride", StartRide);
router.get("/end/ride", FinishRide);
router.get("/ride/status",CheckRideStatus)

export default router;
