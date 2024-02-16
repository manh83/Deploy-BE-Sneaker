import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    code_order: String, // mã đơn hàng
    cartId: [{
        type: mongoose.Schema.Types.Mixed, // dùng Mixed để dữ liệu có thể là chuỗi hoặc số
        ref: "Cart"
    }],
    products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: Number,
          price: Number,
          name:String,
          color: String,
          size: String,
          imgUrl: [
            {type: String}
          ]
        }
      ],
      discountCodeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiscountCode",
        default: null,
      },
    name: String,
    phone:String,
    note: String,
    status: {
        type: String,
        default: "0"
    },

    statusPayment: {
      type: Boolean,
    },

    // discount:String,
    address: {
        city: String, // tỉnh/thành phố
        location: String, // địa chỉ
        district: String // quận/huyện
    },
    totalPrice : Number,

}, { timestamps: true, versionKey: false });

export default mongoose.model("Order", orderSchema);