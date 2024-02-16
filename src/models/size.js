import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    products: [{
        type: mongoose.Types.ObjectId,
        ref: "Product"
      }]
}, { timestamps: true, versionKey: false });

export default mongoose.model("Size", sizeSchema);