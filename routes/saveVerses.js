import express from "express";
import { addSavedVerses } from "../controller/versesController.js";
import { verifyAuth, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add/:id", verifyToken, addSavedVerses);

export default router;
