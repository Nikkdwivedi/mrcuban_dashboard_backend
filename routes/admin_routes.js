import express from "express";
import {
  AccountVerify,
  FetchDriverOrders,
  FetchDrivers,
  FetchUserOrders,
  FetchUsers,
  LoginAPI,
} from "../controllers/admin_controller.js";

const router = express.Router();

router.get("/admin/driver", FetchDrivers);
router.get("/admin/driver/update", AccountVerify);

router.get("/admin/users", FetchUsers);

router.get("/admin/login", LoginAPI);

router.get("/admin/driver/orders", FetchDriverOrders);
router.get("/admin/user/orders", FetchUserOrders);

export default router;
