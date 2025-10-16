import express from "express";
import {
  Forget_Password_for_user,
  LoadUser,
  User_Login,
  User_Register,
  User_Update,
  Verify_Account,
  Verify_Password_for_user,
} from "../controllers/auth_controller.js";
import { UserCheck } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register/user", User_Register);
router.post("/verify/user", Verify_Account);

router.post("/login/user", User_Login);
router.get("/load/user",UserCheck, LoadUser);
router.post("/update/user", User_Update);
router.get("/forgot/user", Forget_Password_for_user);
router.get("/reset/password/user", Verify_Password_for_user);


export default router;
