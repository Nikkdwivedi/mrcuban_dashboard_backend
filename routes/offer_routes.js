import express from "express";
import {
  createOffer,
  getDriverOffers,
  getActiveOffers,
  acceptOffer,
  getCustomerOffers,
  updateOfferStatus,
  cancelOfferRide,
  startOfferRide,
  finishOfferRide,
  cancelUnacceptedOffer,
} from "../controllers/offer_controller.js";

const router = express.Router();

// Driver routes
router.post("/create-offer", createOffer);
router.get("/driver-offers", getDriverOffers);
router.put("/update-offer-status", updateOfferStatus);
router.get("/start-offer-ride", startOfferRide);
router.get("/finish-offer-ride", finishOfferRide);
router.get("/cancel-unaccepted-offer", cancelUnacceptedOffer);

// Customer routes
router.get("/active-offers", getActiveOffers);
router.post("/accept-offer", acceptOffer);
router.get("/customer-offers", getCustomerOffers);
router.get("/cancel-offer", cancelOfferRide);

export default router;
