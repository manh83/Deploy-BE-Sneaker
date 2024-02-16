import mongoose from "mongoose"

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    unicode: {
      type: String,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model("Color", colorSchema)