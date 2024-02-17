import mongoose, { Schema } from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    imgUrl: [
      {
        type: String,
      },
    ],

    variants: [
      {
        imgUrl: [
          {
            type: String,
          },
        ],
        size_id: {
          type: Schema.Types.ObjectId,
          ref: "Size",
        },
        color_id: {
          type: Schema.Types.ObjectId,
          ref: "Color",
        },
        importPrice: Number, // giá tiền nhập hàng
        original_price: Number, // giá gốc
        sellingPrice: Number,   // giá bán ra (giá hiện tại mở bán)
        quantity: Number,  // tổng số lượng đã nhập hàng của 1 biến thể sản phẩm
        quantityImported: Number,  // số lượng nhập hàng,
        totalQuantityVariant: Number,      // tổng số lượng đã nhập hàng
        inventory: {
          type: Number, // số lượng tồn kho 
          default: 0
        },
        sell_quantity: {
          type: Number, // số lượng sp bán ra
          default: 0
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    quantityTotal: Number, // tổng số lượng

    inventoryTotal: Number, // tổng số lượng tồn kho
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    // price: Number,
    // original_price: Number,
    description: String,

    views: {
      type: Number,
      default: 0,
    },

    sell_quantity : Number, // tổng lượt bán ra
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Product", productSchema);