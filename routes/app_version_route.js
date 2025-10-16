import express from "express";
import { createAppVersion,showAllAppVersions,deleteAppVersion } from "../controllers/app_version_controller.js";



const router = express.Router();

router.post("/create-app-version", createAppVersion);
router.get("/get-app-version", showAllAppVersions);
router.delete("/delete-app-version", deleteAppVersion);

export default router;