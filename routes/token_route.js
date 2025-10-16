import express from "express"
import { SavedToken, SendNotification } from "../controllers/token_controller.js";


const router = express.Router();

router.get("/send/push/notification",SendNotification);
router.get("/save/push/token",SavedToken);




export default router;