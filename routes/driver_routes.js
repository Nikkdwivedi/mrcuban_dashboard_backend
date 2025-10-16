import express from "express";
import {
  AccountVerify,
  Driver_Login,
  Driver_Register,
  Forget_Password_for_user,
  LoadUser,
  UploadDocs,
  User_Update,
  Verify_Password_for_user,
} from "../controllers/auth_driver_controller.js";
import { DriverCheck } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register/driver", Driver_Register);
router.get("/driver/account/verify", AccountVerify);
router.post("/driver/upload/doc", UploadDocs);
router.post("/driver/login", Driver_Login);
router.get("/driver/load", DriverCheck, LoadUser);
router.post("/driver/update", User_Update);
router.get("/driver/forgot", Forget_Password_for_user);
router.get("/driver/verify", Verify_Password_for_user);

export default router;
