import mongoose from "mongoose"
import newSletter from "../models/newSletter.js"

export const getAll = async (req, res) => {
  try {
    const email = await newSletter.find()
    if (email.length === 0) {
      return res.json({
        message: "Không lấy được danh sách Email khách hàng đăng kí!",
      })
    }
    return res.status(200).json(email)
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

export const get = async (req, res) => {
  try {
    const email = await newSletter.findById({ _id: req.params.id })
    return res.status(200).json(email)
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

export const create = async (req, res) => {
  try {
    const email = await newSletter.create(req.body)

    if (!email) {
      return res.json({
        message: "Thêm email khách hàng không thành công!",
      })
    }
    return res.status(200).json({
      message: "Thêm email khách hàng thành công!",
      data: email,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

export const remove = async (req, res) => {
  try {
    const data = await newSletter
      .findByIdAndDelete({ _id: req.params.id })
      .exec()
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
