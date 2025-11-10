import express from "express";
import { getPrediction } from "../controllers/predictController.js";

const router = express.Router();

router.post("/:id", getPrediction);

export default router;
