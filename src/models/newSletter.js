import mongoose from "mongoose"

const newSletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model("newSletter", newSletterSchema)
