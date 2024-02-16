import Product from "../models/product.js"
import Size from '../models/size.js';
import mongoose from 'mongoose';

export const getAll = async (req, res) => {
  try {
    const sizes = await Size.find();
    return res.status(200).json(sizes);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const get = async (req, res) => {
  try {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        message: "Không tìm thấy size trong database"
      })
    }
    const sizes = await Size.findById(req.params.id).populate("products");
    if (!sizes) {
      return res.json({
        message: "Không tìm thấy size!",
      });
    }
    return res.status(200).json({
      message: "Lấy size thành công!",
      data: sizes,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {

    const sizes = await Size.create(req.body);

    if (!sizes) {
      return res.json({
        message: "Thêm size không thành công!",
      });
    }
    return res.status(200).json({
      message: "Thêm size thành công!",
      data: sizes,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const sizeId = req.params.id;

    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        message: "Không tìm thấy size trong database"
      })
    }

    const sizes = await Size.findByIdAndDelete({ _id: req.params.id });
    if (!sizes) {
      return res.json({
        message: "Không tìm thấy size!",
      });
    }
    await Product.deleteMany({ sizeId });

    return res.status(200).json({
      message: "Size đã được xóa!",
      data: sizes,
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

    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        message: "Không tìm thấy size trong database"
      })
    }

    const sizes = await Size.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!sizes) {
      return res.status(404).json({
        message: "Không tìm thấy size!",
      });
    }
    return res.status(200).json({
      message: "Size đã được cập nhật thành công!",
      data: sizes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductsBysize = async (req, res) => {
  try {
    const sizeId = req.params.id;

    // Kiểm tra trong mongoose nếu id không phải là một ObjectId thì trả về message
    if (!mongoose.Types.ObjectId.isValid(sizeId)) {
      return res.status(401).json({
        message: "Không tìm thấy ID size"
      });
    }

    // Tìm danh mục dựa trên sizeId
    const size = await Size.findById(sizeId);

    if (!size) {
      return res.status(400).json({
        message: "Không tồn tại size bạn đang tìm"
      });
    }

    // Lấy sản phẩm dựa trên danh mục
    const products = await Product.find({ size_id: sizeId });

    return res.status(200).json({
      data: products
    });
    
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};