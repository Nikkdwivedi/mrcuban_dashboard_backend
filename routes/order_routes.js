

import express from "express";
import { customerHistoryOrder, customerUpcommingOrder, DriverHistoryOrder, DriverUpcommingOrder } from "../controllers/order_controller.js";

const router = express.Router();


router.get("/get/customer/upcoming/order",customerUpcommingOrder);
router.get("/get/customer/history/order",customerHistoryOrder);

router.get("/get/driver/upcoming/order",DriverUpcommingOrder);
router.get("/get/driver/history/order",DriverHistoryOrder);


export default router;


