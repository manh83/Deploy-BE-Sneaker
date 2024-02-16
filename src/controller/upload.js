import cloudinary from "../../config/cloudinary.js";
import dotenv from "dotenv";
dotenv.config();

// get all image
export const getAllImage = async (req, res) => {
  try {
    const folderName = process.env.FOLDER_UPLOAD;
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });
    if (result.length === 0) {
      return res.status(400).json({
        message: "Không có hình ảnh nào",
      });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// upload images
export const uploadImages = async (req, res) => {
  const files = req.files;
  if (!files || !files.length) {
    return res.status(400).json({
      message: "Không có file nào được tải lên",
    });
  }

  try {
    const uploadFiles = files.map(async (file) => {
      return {
        url: file.path, // Lấy đường dẫn từ multer
        publicId: file.filename,
      };
    });

    const uploadAllFiles = await Promise.all(uploadFiles);
    return res.status(200).json({
      message: "Tải ảnh lên thành công",
      urls: uploadAllFiles,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Xóa tất cả ảnh trên Cloudinary
export const deleteAllImages = async (req, res) => {
  try {
    // Gọi API xóa tất cả ảnh
    cloudinary.api.delete_all_resources((result) => {
      return res
        .status(200)
        .json({ message: "Tất cả ảnh đã được xóa thành công" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete images
export const deleteImage = async (req, res) => {
  const publicId = `${process.env.FOLDER_UPLOAD}/${req.params.publicId}`;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "not found") {
      return res.status(400).json({
        message: "Không tìm thấy hình ảnh cần xóa",
      });
    }
    return res.status(200).json({
      message: "Xóa ảnh thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Xóa ảnh không thành công vui lòng thử lại sau",
    });
  }
};
