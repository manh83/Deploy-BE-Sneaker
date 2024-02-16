import mongoose from "mongoose"

const discountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    percentage: {
      type: Number,
    },
    amountDiscount: {
      type: Number,
    },
    minimumOrderAmount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model("DiscountCode", discountCodeSchema)
