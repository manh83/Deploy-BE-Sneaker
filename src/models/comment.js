import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product"
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: "Order"
    },
    content: String, 
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

export default mongoose.model("Comment", commentSchema);