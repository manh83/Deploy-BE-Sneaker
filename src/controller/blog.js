import Blog from '../models/blog.js';
import mongoose from 'mongoose';

export const getAll = async (req, res) => {
    try {
        //   const categorys = await Category.find().populate("products");
        const blogs = await Blog.find();
        if (blogs.length === 0) {
            return res.json({
                message: "Không lấy được blogs!",
            });
        }
        return res.status(200).json({
            message: "Lấy danh sách blog thành công!",
            data: blogs,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

export const get = async (req, res) => {
    try {

        const { id } = req.params

        // Kiểm tra trong mongoose nếu id không phải là một ObjectId thì trả về message
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).json({
                message: "Không tìm thấy ID danh mục"
            })
        }

        // const categorys = await Category.findById(req.params.id).populate("products");
        const blogs = await Blog.findById(req.params.id);
        if (!blogs) {
            return res.status(400).json({
                message: "Không tồn tại blog bạn đang tìm"
            })
        }
        return res.status(200).json({
            message: "Lấy blog thành công!",
            ...blogs.toObject()
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export const create = async (req, res) => {
    try {

        const blogs = await Blog.create(req.body);

        if (!blogs) {
            return res.json({
                message: "Thêm Blog không thành công!",
            });
        }
        return res.status(200).json({
            message: "Thêm Blog thành công!",
            data: blogs,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

export const remove = async (req, res) => {
    try {
        const blogId = req.params.id;

        const { id } = req.params

        // Kiểm tra trong mongoose nếu id không phải là một ObjectId thì trả về message
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).json({
                message: "Không tìm thấy ID danh mục"
            })
        }

        const blogs = await Blog.findByIdAndDelete({ _id: req.params.id });
        if (!blogs) {
            return res.status(400).json({
                message: "Không tồn tại danh mục cần xóa"
            })
        }



        return res.status(200).json({
            message: "Blog đã được xóa!",
            data: blogs,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        })
    }
}

export const update = async (req, res) => {
    try {

        const { id } = req.params

        // Kiểm tra trong mongoose nếu id không phải là một ObjectId thì trả về message
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).json({
                message: "Không tìm thấy blog cần update"
            })
        }

        const blogs = await Blog.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });

        if (!blogs) {
            return res.status(400).json({
                message: "Không tồn tại blog cần cập nhật"
            })
        }

        return res.status(200).json({
            message: "Blog đã được cập nhật thành công!",
            data: blogs,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};