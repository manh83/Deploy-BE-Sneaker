import Color from "../models/color.js"
import mongoose from "mongoose"

export const getAll = async (req, res) => {
  try {
    const colors = await Color.find()
    if (colors.length === 0) {
      return res.json({
        message: "Không lấy được danh sách Color!",
      })
    }
    return res.status(200).json(colors)
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

export const get = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Không tìm thấy color trong database",
      })
    }

    const colors = await Color.findById(req.params.id)

    if (!colors) {
      return res.json({
        message: "Không tìm thấy Color!",
      })
    }
    return res.status(200).json({
      message: "Lấy Color thành công!",
      data: colors,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

export const create = async (req, res) => {
  try {
    const colors = await Color.create(req.body)

    if (!colors) {
      return res.json({
        message: "Thêm Color không thành công!",
      })
    }
    return res.status(200).json({
      message: "Thêm Color thành công!",
      data: colors,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

export const remove = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Không tìm thấy color trong database",
      })
    }

    const colors = await Color.findByIdAndDelete({ _id: req.params.id })
    if (!colors) {
      return res.json({
        message: "Không tìm thấy Color!",
      })
    }
    return res.status(200).json({
      message: "Color đã được xóa!",
      data: colors,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const update = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Không tìm thấy color trong database",
      })
    }

    const colors = await Color.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    )
    if (!colors) {
      return res.status(404).json({
        message: "Không tìm thấy Color!",
      })
    }
    return res.status(200).json({
      message: "Color đã được cập nhật thành công!",
      data: colors,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
