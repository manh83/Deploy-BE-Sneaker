import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.js";
import express from "express";
import {
  deleteAllImages,
  deleteImage,
  getAllImage,
  uploadImages,
} from "../controller/upload.js";
import dotenv from "dotenv";
dotenv.config();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.FOLDER_UPLOAD,
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
  },
});

const upload = multer({ storage: storage }).array("images", 10);

const router = express.Router();

// Tạo tuyến đường để xóa tất cả ảnh trong cloudinary
router.delete("/images/delete-all", deleteAllImages);

router.post("/images/upload", upload, uploadImages);
router.get("/images", getAllImage);
router.delete("/images/:publicId/delete", deleteImage);

export default router;
