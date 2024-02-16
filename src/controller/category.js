import Category from '../models/category.js';
import Product from "../models/product.js"
import mongoose from 'mongoose';

export const getAll = async (req, res) => {
  try {
    const categorys = await Category.find();
    if (categorys.length === 0) {
      return res.json({
        message: "Không lấy được danh sách Category!",
      });
    }
    return res.status(200).json(categorys);
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

    const categorys = await Category.findById(req.params.id).populate("products");
    if (!categorys) {
      return res.status(400).json({
        message: "Không tồn tại danh mục bạn đang tìm"
      })
    }
    return res.status(200).json({
      message: "Lấy Category thành công!",
      ...categorys.toObject()
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {

    const categorys = await Category.create(req.body);

    if (!categorys) {
      return res.json({
        message: "Thêm Category không thành công!",
      });
    }
    return res.status(200).json({
      message: "Thêm Category thành công!",
      data: categorys,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const { id } = req.params

    // Kiểm tra trong mongoose nếu id không phải là một ObjectId thì trả về message
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(401).json({
        message: "Không tìm thấy ID danh mục"
      })
    }

    const categorys = await Category.findByIdAndDelete({ _id: req.params.id });
    if (!categorys) {
      return res.status(400).json({
        message: "Không tồn tại danh mục cần xóa"
      })
    }

    await Product.deleteMany({ categoryId });

    return res.status(200).json({
      message: "Category đã được xóa!",
      data: categorys,
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
        message: "Không tìm thấy danh mục cần update"
      })
    }

    const categorys = await Category.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });

    if (!categorys) {
      return res.status(400).json({
        message: "Không tồn tại danh mục cần cập nhật"
      })
    }

    return res.status(200).json({
      message: "Category đã được cập nhật thành công!",
      data: categorys,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Kiểm tra trong mongoose nếu id không phải là một ObjectId thì trả về message
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(401).json({
        message: "Không tìm thấy ID danh mục"
      });
    }

    // Tìm danh mục dựa trên categoryId
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(400).json({
        message: "Không tồn tại danh mục bạn đang tìm"
      });
    }

    // Lấy sản phẩm dựa trên danh mục
    const products = await Product.find({ categoryId: categoryId });
    
    return res.status(200).json(products);
    
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};