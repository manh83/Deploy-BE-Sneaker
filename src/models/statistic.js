import mongoose, { Schema } from "mongoose";

const statisticSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Statistic", statisticSchema);
