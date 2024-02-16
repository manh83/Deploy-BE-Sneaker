import Order from "../models/order.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";

export const createComment = async (req, res) => {
  try {
    const { userId, productId, orderId, content } = req.body;

    // console.log(userId);

    // Lấy thông tin người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại." });
    }

    // console.log(user);

    if (user.role === "admin" || user.role === "staff") {
      // Gửi yêu cầu tạo bình luận mà không cần kiểm tra mua hàng
      const comment = new Comment({ userId, productId, content });
      await comment.save();
      return res.status(200).json({ message: "Bình luận đã được tạo." });
    }

    // Kiểm tra xem người dùng đã bình luận trước đó chưa
    const existingComment = await Comment.findOne({ userId, productId });
    if (existingComment) {
      return res
        .status(400)
        .json({ message: "Bạn chỉ có thể đánh giá 1 lần." });
    }

    // Kiểm tra người dùng đã mua sản phẩm trong đơn hàng chưa
    const hasBoughtProduct = await Order.exists({
      _id: orderId,
      userId,
      "products.productId": productId,
    });
    if (!hasBoughtProduct) {
      return res
        .status(400)
        .json({ message: "Bạn không có quyền bình luận sản phẩm này." });
    }

    // Kiểm tra trạng thái của đơn hàng
    const order = await Order.findById(orderId);
    if (!order || order?.status !== "4") {
      // console.log(order?.status);
      return res
        .status(400)
        .json({ message: "Đơn hàng phải được giao thành công thì bạn mới có thể đánh giá." });
    }

    // Tạo bình luận mới
    const comment = await Comment.create({
      userId,
      productId,
      orderId,
      content,
    });

    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi tạo bình luận." });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("userId", "-password") // Populate thông tin người dùng, loại bỏ trường password
      .populate("productId"); // Populate thông tin sản phẩm
    // Truy cập trường productId trong từng comment
    // comments.forEach(comment => {
    //   console.log(comment.productId?._id);
    // });

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy danh sách bình luận." });
  }
};

export const getCommentsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    // Lấy tất cả các bình luận dựa trên productId
    const comments = await Comment.find({ productId }).populate("userId");

    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy danh sách bình luận." });
  }
};

export const updateCommentById = async (req, res) => {
  try {
    // console.log(req.body);
    const { id } = req.params;
    const { content } = req.body;

    // Tìm bình luận dựa trên id
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại." });
    }

    // Kiểm tra xem người dùng có quyền chỉnh sửa bình luận hay không
    if (comment.userId.toString() !== req.body.userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa bình luận này." });
    }

    // Cập nhật nội dung bình luận
    comment.content = content;
    comment.updatedAt = Date.now();
    await comment.save();

    return res
      .status(200)
      .json({ message: "Đã cập nhật bình luận thành công." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi cập nhật bình luận." });
  }
};

// delete comment của user
export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm bình luận dựa trên id
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại." });
    }

    // Kiểm tra xem người dùng có quyền xóa bình luận hay không
    if (comment.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa bình luận này." });
    }

    // Xóa bình luận
    await Comment.findByIdAndRemove(id);

    return res.status(200).json({ message: "Đã xóa bình luận thành công." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi xóa bình luận." });
  }
};

// delete comment cho admin
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Xóa bình luận dựa trên id
    const deletedComment = await Comment.findByIdAndRemove(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Bình luận không tồn tại." });
    }

    return res.status(200).json({ message: "Đã xóa bình luận thành công." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi xóa bình luận." });
  }
};

// Thêm một trả lời vào bình luận
export const addReply = async (req, res) => {
  try {
    const { commentId, userId, content } = req.body;

    // Tìm bình luận dựa trên commentId
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại." });
    }

    // Kiểm tra xem người dùng có quyền trả lời bình luận hay không
    // Ví dụ: Kiểm tra vai trò của người dùng hoặc xác thực người dùng
    if (!canReplyComment(req.userRole)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền trả lời bình luận này." });
    }

    // Tạo trả lời mới
    const reply = {
      userId,
      content,
      createdAt: Date.now(),
    };

    // Thêm trả lời vào mảng replies của bình luận
    comment.replies.push(reply);
    await comment.save();

    return res.status(200).json({ message: "Đã thêm trả lời thành công." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi thêm trả lời." });
  }
};

// Sửa đổi một trả lời trong bình luận
export const editReply = async (req, res) => {
  try {
    const { commentId, replyId, content } = req.body;

    // Tìm bình luận dựa trên commentId
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại." });
    }

    // Kiểm tra xem người dùng có quyền chỉnh sửa trả lời hay không
    // Ví dụ: Kiểm tra vai trò của người dùng hoặc xác thực người dùng
    if (!canEditReply(req.userRole)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa trả lời này." });
    }

    // Tìm trả lời dựa trên replyId
    const reply = comment.replies.find(
      (reply) => reply._id.toString() === replyId
    );

    if (!reply) {
      return res.status(404).json({ message: "Trả lời không tồn tại." });
    }

    // Cập nhật nội dung trả lời
    reply.content = content;
    reply.updatedAt = Date.now();
    await comment.save();

    return res.status(200).json({ message: "Đã cập nhật trả lời thành công." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi cập nhật trả lời." });
  }
};

// Xóa một trả lời trong bình luận
export const deleteReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;

    // Tìm bình luận dựa trên commentId
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại." });
    }

    // Kiểm tra xem người dùng có quyền xóa trả lời hay không
    // Ví dụ: Kiểm tra vai trò của người dùng hoặc xác thực người dùng
    if (!canDeleteReply(req.userRole)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa trả lời này." });
    }

    // Xóa trả lời dựa trên replyId
    const replyIndex = comment.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );

    if (replyIndex === -1) {
      return res.status(404).json({ message: "Trả lời không tồn tại." });
    }

    comment.replies.splice(replyIndex, 1);
    await comment.save();

    return res.status(200).json({ message: "Đã xóa trả lời thành công." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi xóa trả lời." });
  }
};
