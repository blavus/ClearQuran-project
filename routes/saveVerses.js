import express from "express";
import { addSavedVerses } from "../controller/versesController.js";
import { verifyAuth } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add/:id", verifyAuth, addSavedVerses);

export default router;
