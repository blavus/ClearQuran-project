import express from "express";
import { addSavedVerses, getSavedVerse, getAllSavedVerses } from "../controller/versesController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/get/all", verifyToken, getAllSavedVerses);
router.get("/get/:id", verifyToken, getSavedVerse);
router.post("/add/:id", verifyToken, addSavedVerses);

export default router;
