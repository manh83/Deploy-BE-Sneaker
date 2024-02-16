import mongoose from "mongoose"

const useSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    confirmPassword: {
      type: String,
      minLength: 6,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    discountUsed: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
      default: "member",
    },
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model("User", useSchema)
