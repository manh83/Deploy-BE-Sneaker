import DiscountCode from "../models/discountCode.js"
import mongoose from "mongoose"

export const getAllDiscountCodes = async (req, res) => {
  try {
    const discountCodes = await DiscountCode.find().sort({ createdAt: -1 })
    if (discountCodes.length === 0) {
      return res.json({
        message: "Failed to get Discount Code list!",
      })
    }
    return res.status(200).json(discountCodes)
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

export const getDiscountCode = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Discount Code not found in the database",
      })
    }

    const discountCode = await DiscountCode.findById(req.params.id)

    if (!discountCode) {
      return res.json({
        message: "Discount Code not found!",
      })
    }
    return res.status(200).json({
      message: "Discount Code obtained successfully!",
      data: discountCode,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

export const createDiscountCode = async (req, res) => {
  try {
    const discountCode = await DiscountCode.create(req.body)

    if (!discountCode) {
      return res.json({
        message: "Adding Discount Code failed!",
      })
    }
    return res.status(200).json({
      message: "Discount Code added successfully!",
      data: discountCode,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

export const removeDiscountCode = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Discount Code not found in the database",
      })
    }

    const discountCode = await DiscountCode.findByIdAndDelete({
      _id: req.params.id,
    })
    if (!discountCode) {
      return res.json({
        message: "Discount Code not found!",
      })
    }
    return res.status(200).json({
      message: "Discount Code has been deleted!",
      data: discountCode,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const updateDiscountCode = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Discount Code not found in the database",
      })
    }

    const discountCode = await DiscountCode.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    )
    if (!discountCode) {
      return res.status(404).json({
        message: "Discount Code not found!",
      })
    }
    return res.status(200).json({
      message: "Discount Code has been updated successfully!",
      data: discountCode,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
