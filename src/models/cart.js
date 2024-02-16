
import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product"
        },
        imgUrl: [
          {type: String}
        ],
        quantity: {
          type: Number,
        },
        size: {
          type: String
        },
        color: {
          type: String
        },
        totalAmount: Number,  // tổng tiền của 1 biến thể sản phẩm (đã nhân với quantity)
        price: Number // giá tiền của 1 sản phẩm
      }
    ]
  },{timestamps: true, versionKey: false});
  

export default mongoose.model("Cart",cartSchema)