import jwt from "jsonwebtoken";
import User from "../models/user.js";
export const checkPermissionCart = async (req, res, next) => {
  try {

    if (!req.headers.authorization) {
      // Không có mã thông báo nào được cung cấp, hãy chuyển sang phần mềm trung gian hoặc tuyến đường tiếp theo
      return next();
  }
    // lấy jwt token từ header
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "sneakers", async (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(404).json({
            message: "Token không hợp lệ",
          });
        }
        if (err.name === "TokenExpiredError") {
          return res.status(404).json({
            message: "Token hết hạn",
          });
        }
      }
      // Lưu thông tin người dùng vào req.user
      const user = await User.findById(payload._id);
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
