import express from "express";
import { deleteUser, getAllUser, getUser, updateUser } from "../controller/userController.js";
import { verifyAdmin, verifyAuth } from "../middleware/verifyToken.js";


const router = express.Router();
router.get("/",verifyAdmin, getAllUser);
router.get("/:id", verifyAuth, getUser);
router.delete("/:id", verifyAdmin, deleteUser);
router.put("/:id", verifyAuth, updateUser);

export default router;
