import express from "express";
import { createComment, deleteComment, deleteCommentById, getAllComments, getCommentsByProductId, updateCommentById } from "../controller/comment.js";

const router = express.Router();

// Định nghĩa các route cho comment
router.post("/comments", createComment);
router.get("/comments", getAllComments);
router.get("/comments/:productId", getCommentsByProductId);
router.delete("/comments/:id", deleteComment);  // delete comment của admin
router.put("/comments/:id", updateCommentById);
router.delete("/comment/:id", deleteCommentById); // delete comment của user


export default router;