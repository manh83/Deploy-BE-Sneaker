import Product from "../models/product.js"
import Category from "../models/category.js"
import { productSchema } from "../schema/product.js"
import mongoose from "mongoose"
import Color from "../models/color.js"
import Size from "../models/size.js"
import Cart from "../models/cart.js"

export const getProduct = async (req, res) => {
  try {
    // const products = await Product.find({ $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }] }) // chỉ lấy ra sản phẩm có isDeleted ==false
    const products = await Product.find().sort({createdAt: -1})
        .populate({
          path: "variants.size_id",
          model: "Size",
        })
        .populate({
          path: "variants.color_id",
          model: "Color",
        }).exec();
    if (products.length === 0) {
      return res.status(400).json({
        message: "Không có sản phẩm nào",
      })
    }
    for (const product of products) {
      let quantityTotal = 0;
      let sell_quantity = 0;
      let inventoryTotal = 0;

      // Lặp lại qua từng biến thể của sản phẩm
      for (const variant of product.variants) {
        // Tính tổng số lượng cho từng sản phẩm
        quantityTotal += variant.quantity || 0;
        sell_quantity += variant.sell_quantity || 0;
        // Tính toán tồn kho cho từng biến thể
        if(variant.quantity>0){
          variant.inventory = (variant.quantity || 0) - (variant.sell_quantity || 0);
          inventoryTotal += variant.inventory;
        }

      }

      // Đặt tổng số lượng cho từng sản phẩm
      product.quantityTotal = quantityTotal;
      product.sell_quantity = sell_quantity;
      product.inventoryTotal = inventoryTotal;

      // Tính toán và đặt InventoryTotal cho từng sản phẩm
    }
    return res.status(200).json(products)
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    })
  }
}


// thêm biến thể sản phẩm
export const createProductVariant = async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product by ID
    const product = await Product.findById(productId).exec();

    if (!product) {
      return res.status(400).json({
        message: "Không có sản phẩm nào",
      });
    }

    const variantData = req.body;
    const inventory = variantData.quantity
    const totalQuantityVariant = variantData.quantity
    const newVariant = {
      ...variantData,
      _id: new mongoose.Types.ObjectId(), 
      isDeleted: false,
      inventory,
      totalQuantityVariant
    };

  
    product.variants.push(newVariant);
   
    if (variantData.imgUrl && Array.isArray(variantData.imgUrl)) {
      product.imgUrl = product.imgUrl.concat(variantData.imgUrl);
    }
    // Save the updated product
    await product.save();

    return res.status(201).json({
      message: "Biến thể sản phẩm đã được thêm thành công",
      product: product
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi thêm biến thể sản phẩm:" +error,
    });
  }
};


// hiện ra chi tiết của 1 sản phẩm
export const readProduct = async (req, res) => {
  try {
    const data = await Product.findById({ _id: req.params.id })
      .populate({
        path: 'variants',
        populate: [
          { path: 'size_id', model: 'Size' },
          { path: 'color_id', model: 'Color' }
        ]
      })
      .exec()

      if (data) {
        data.views += 1;
        await data.save();
      }else{
        return res.status(400).json({
          message: "Không có sản phẩm nào",
        })
      }

 

    return res.status(200).json(data)
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    })
  }
}


// Hiển thị chi tiết biến thể của 1 sản phẩm
export const getVariantDetails = async (req, res) => {
  try {
    // Extract the product ID and variant ID from the request parameters
    const { productId, variantId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product and variants exist
    if (!product || !product.variants || product.variants.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc biến thể' });
    }

    // Find the variant by ID
    const variant = product.variants.find((v) => v._id.toString() === variantId);

    // Check if the variant exists
    if (!variant) {
      return res.status(404).json({ message: 'Không tìm thấy biến thể' });
    }

    // Return the variant details
    res.status(200).json(variant);
  } catch (error) {
    res.status(500).json({ message: 'Đã có lỗi gì đó',error: error.message });
  }
};


// thêm sản phẩm trang chính
export const createProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false })
    if (error) {
      const errDetails = error.details.map((err) => err.message)
      return res.status(400).json({
        message: errDetails
      })
    }

    const existingProduct = await Product.findOne({ name: req.body.name });
    if (existingProduct) {
      return res.status(400).json({
        message: 'Tên sản phẩm đã tồn tại hãy thử tên khác',
      });
    }
    // Kiểm tra xem trường isDeleted có tồn tại trong req.body hay không
    if (!req.body.hasOwnProperty('isDeleted')) {
      // Nếu không tồn tại, thiết lập giá trị mặc định là false
      req.body.isDeleted = false;
    }

    const newProduct = await Product.create(req.body);
    if (!newProduct) {
      return res.json({
          message:  "Thêm sản phẩm không thành công",
      });
  }
  await Category.findByIdAndUpdate(newProduct.categoryId, {
      $addToSet: {
          products: newProduct._id,
      },
  });
    return res.json({
      message: "Thêm sản phẩm thành công",
      data: newProduct,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};


// xóa sản phẩm tạm thời xóa mềm cập nhật lại isDeleted
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Không tìm thấy sản phẩm cần xóa",
      })
    }

    const productToBeDeleted = await Product.findById(req.params.id).exec()
    if (!productToBeDeleted) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại trong database",
      })
    }

    productToBeDeleted.isDeleted = true;
    await productToBeDeleted.save();

    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
      productRemoved: productToBeDeleted,
    })
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    })
  }
}


// cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Không tìm thấy sản phẩm cần cập nhật",
      })
    }

    const updateData = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    ).exec()

    if (!updateData) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại trong database",
      })
    }

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      productUpdated: updateData,
    })
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    })
  }
}


// cập nhật biến thể sản phẩm
export const updateVariantProduct = async (req,res) => {
  try {
    const { productId, variantId } = req.params;
    const { quantityImported,quantity,sellingPrice,original_price,importPrice } = req.body; // Assuming quantityImported is provided in the request body

    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product and variants exist
    if (!product || !product.variants || product.variants.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc biến thể' });
    }

    // Find the variant by ID
    const variant = product.variants.find((v) => v._id.toString() === variantId);

    // Check if the variant exists
    if (!variant) {
      return res.status(404).json({ message: 'Không tìm thấy biến thể' });
    }

    if(!variant.sellingPrice || variant.sellingPrice ===0){
      variant.sellingPrice = sellingPrice
    }else{
      variant.sellingPrice = sellingPrice
    }


    if(!variant.original_price || variant.original_price === 0){
      variant.original_price = original_price
    }else{
      variant.original_price = original_price
    }

    if(!variant.importPrice || variant.importPrice === 0){
      variant.importPrice = importPrice
    }else{
      variant.importPrice = importPrice
    }


      if (quantity===0 && quantityImported===0) {
        variant.inventory = 0 
        variant.quantity = 0
      }else if(quantityImported !== 0 && quantity!==0){
        variant.inventory += quantityImported
        variant.quantity += quantityImported;
        variant.totalQuantityVariant += quantityImported
      }else if(quantity===0 && quantityImported !== 0 ){
        variant.inventory = quantityImported
        variant.quantity = quantityImported;
        variant.totalQuantityVariant += quantityImported
      }


      


    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Cập nhật biến thể thành công",
      variant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// xóa biến thể sản phẩm
export const removeVariantProduct = async (req,res) => {
  try {
    const { productId, variantId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product and variants exist
    if (!product || !product.variants || product.variants.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc biến thể' });
    }

    // Find the variant by ID
    const variant = product.variants.find((v) => v._id.toString() === variantId);

    // Check if the variant exists
    if (!variant) {
      return res.status(404).json({ message: 'Không tìm thấy biến thể' });
    }

    // Update the variant with the imported quantity
    variant.isDeleted = true;

    // Save the updated product
    await product.save();

    // Return the updated product or variant as needed
    res.status(200).json(variant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// khôi phục biến thể sản phẩm 
export const restoreVariantProduct = async (req,res) => {
  try {
    const { productId, variantId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product and variants exist
    if (!product || !product.variants || product.variants.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc biến thể' });
    }

    // Find the variant by ID
    const variant = product.variants.find((v) => v._id.toString() === variantId);

    // Check if the variant exists
    if (!variant) {
      return res.status(404).json({ message: 'Không tìm thấy biến thể' });
    }

    // Update the variant with the imported quantity
    variant.isDeleted = false;

    // Save the updated product
    await product.save();

    // Return the updated product or variant as needed
    res.status(200).json(variant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// Khôi phục sản phẩm
export const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Định dạng ID không hợp lệ để khôi phục sản phẩm",
      });
    }

    const restoredProduct = await Product.findById(req.params.id)
    if (!restoredProduct) {
      return res.status(400).json({
        message: "Sản phẩm không tồn tại trong database",
      })
    }
    restoredProduct.isDeleted = false;
    await restoredProduct.save();

    return res.status(200).json({
      message: "Khôi phục sản phẩm thành công",
      productRestored: restoredProduct,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
};


// lấy ra tất cả dữ liệu đã xóa
export const getAllDeletedProducts = async (req, res) => {
  try {
    const deletedProducts = await DeletedProduct.find().sort({ createdAt: -1 }).exec();

    if (deletedProducts.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào",
      });
    }

    return res.status(200).json(deletedProducts);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

//Xóa sản phẩm vĩnh viễn
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
      return res.status(400).json({
        message: "Không tìm thấy sản phẩm cần xóa"
      })
    }

    return res.status(200).json({
      message: "Xóa sản phẩm thành công"
    })
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}


//lấy sản phẩm hot
export const getHotProducts = async (req, res) => {
  try {
    const hotProducts = await Product.find()
      .sort({ views: -1 })
      .limit(8)
      .exec();

    if (hotProducts.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào",
      });
    }

    return res.status(200).json(hotProducts);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
}


// xóa biến thể sản phẩm
export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantId } = req.body;

    const result = await Product.updateOne(
      { _id: id, "variants._id": variantId },
      { $set: { "variants.$.isDeleted": true } }
    );

    if (result.nModified === 0) {
      return res.status(400).json({
        message: "Biến thể không tồn tại trong sản phẩm",
      });
    }

    // Lấy sản phẩm sau khi cập nhật
    const updatedProduct = await Product.findById(id);

    return res.status(200).json({
      message: "Xóa biến thể thành công",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

