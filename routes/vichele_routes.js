import express from "express";
import {
  createVichele,
  FetchVichele,
  VicheleDelete,
} from "../controllers/vichele_controller.js";

const router = express.Router();

router.get("/create/vichele", createVichele);
router.get("/vichele", FetchVichele);

router.get("/delete/vichele", VicheleDelete);

export default router;
