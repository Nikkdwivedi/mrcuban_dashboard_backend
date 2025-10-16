import express from "express";
import {
  CommentGetByCustomer,
  CommentGetByDriver,
  CommentGetByDriver2,
  AllCommentGetByDriver,
  createComment,
  UpdateRatingByAdmin
} from "../controllers/rating_controller.js";
import { getNotifications } from "../controllers/notification_controller.js";

const router = express.Router();

router.get("/create/comment", createComment);
router.get("/get/comment/by/user", CommentGetByCustomer);
router.get("/get/comment/by/driver", CommentGetByDriver);
router.get("/get/comment/by/driver/5", CommentGetByDriver2);
router.get("/get/comment/all/driver", AllCommentGetByDriver);
router.put("/update/rating/:id", UpdateRatingByAdmin);
router.get("/get/notifications", getNotifications);





export default router;
