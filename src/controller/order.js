import Order from "../models/order.js"
import Cart from "../models/cart.js"
import Product from "../models/product.js"
import Color from "../models/color.js"
import Size from "../models/size.js"



export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("products.productId").populate({path: "userId", select: "username"}).sort({ createdAt: -1 });
        if(orders.length === 0){
            return res.status(400).json({
                message: "Không lấy được danh sách Order!"
            })
        }
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error });
    }
};


//lấy ra chi tiết đơn hàng theo id
export const getOrdersById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("products.productId")
            .populate({ path: "userId", select: "username" })
            .populate('discountCodeId'); // Add this line to populate discountCodeId

        if (!order) {
            return res.json({
                message: "Không tìm thấy Order!",
            });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};



// Chức năng lấy ra dữ liệu của người dùng đã mua hàng để kết hợp với chức năng bình luận
export const getUserOrders = async (req, res) => {
    const userId = req.user ? req.user._id : null;

    try {
        if(req.user){
            const orders = await Order.find({ userId }).populate("products.productId").populate({path: "userId", select: "username"}).sort({ createdAt: -1 });
            if(orders.length === 0){
                return res.status(400).json({
                    message: "Bạn chưa có đơn hàng nào"
                })
            }
            return res.status(200).json(orders);
        }

    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error });
    }
};



//generateRandomCode() --> Hàm thực thi tạo ngẫu nhiên mã đơn hàng
const generateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';

    const randomLetters = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]);
    const randomDigits = Array.from({ length: 3 }, () => digits[Math.floor(Math.random() * digits.length)]);

    return randomLetters.join('') + randomDigits.join('');
};


export const createOrder = async (req, res) => {
    const userId = req.user ? req.user._id : null;
    try {
        if (!req.body) {
            return res.status(400).json("Hãy thêm thông tin order cần tạo !");
        }

        const codeOrder = generateRandomCode();

       
        const order = await Order.create({ ...req.body, userId, code_order: codeOrder});

        const productIdsToDelete = req.body.cartId;

        if (req.user) {
            for (const productIdToDelete of productIdsToDelete) {
                await Cart.updateMany(
                    { userId: req.user._id, 'products._id': productIdToDelete },
                    { $pull: { products: { _id: productIdToDelete } } }
                );
            }
        }

        // Update sell_quantity for each product in the order
        await Promise.all(order.products.map(async (product) => {
            const colorId = await Color.findOne({ unicode: product.color }).select('_id');
        const sizeId = await Size.findOne({ name: product.size }).select('_id');

        const filter = {
            _id: product.productId,
            'variants.size_id': sizeId,
            'variants.color_id': colorId
        };


            const existingProduct = await Product.findOne(filter);


            if (!existingProduct) {
                return null; 
            }

            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: product.productId,
                    'variants': {
                        $elemMatch: {
                            'size_id': sizeId,
                            'color_id': colorId
                        }
                    }
                },
                {
                    $inc: {
                        'variants.$.sell_quantity': product.quantity,
                        'variants.$.inventory': -product.quantity
                    }
                },
                { new: true }
            );

            updatedProduct.save();
        }));

        return res.status(200).json({
            message: "Đã thêm 1 order",
            order
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(404).json({ message: "Lỗi thêm 1 order !", err: error.message });
    }
};




// Cập nhật trạng thái đơn hàng.Nếu status == 2 tương đương là đơn hủy thì cập nhật lại số lượng đã bán và tồn kho của variants sản phẩm
export const updateOrder = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json("Không tìm thấy order cần update !");
        }

        const orderId = req.params.id;
        const newStatus = req.body.status;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Không tìm thấy Order!",
            });
        }

        // Check if the order status is being updated
        if (newStatus !== undefined && newStatus !== order.status) {
            // Update order status
            order.status = newStatus;
            await order.save();

            // Check if the new status is '2' (completed)
            if (newStatus === '2') {
                // Update product quantities for completed orders
                await Promise.all(order.products.map(async (product) => {
                    const colorId = await Color.findOne({ unicode: product.color }).select('_id');
                    const sizeId = await Size.findOne({ name: product.size }).select('_id');

                    const filter = {
                        _id: product.productId,
                        'variants.size_id': sizeId,
                        'variants.color_id': colorId
                    };

                    const existingProduct = await Product.findOne(filter);

                    if (!existingProduct) {
                        return null;
                    }

                    const updatedProduct = await Product.findOneAndUpdate(
                        {
                            _id: product.productId,
                            'variants': {
                                $elemMatch: {
                                    'size_id': sizeId,
                                    'color_id': colorId
                                }
                            }
                        },
                        {
                            $inc: {
                                'variants.$.sell_quantity': -product.quantity,
                                'variants.$.inventory': product.quantity
                            }
                        },
                        { new: true }
                    );

                    updatedProduct.save();
                }));
            }
        }

        // Continue with the rest of the update logic...
        
        return res.status(200).json({
            message: "Đã cập nhật xong order",
            order
        });
    } catch (error) {
        return res.status(404).json({ mesage: "lỗi update order !", error: error.message });
    }
};


export const removeOrder = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json("Hãy thêm thông tin order cần tạo !");
        };

        const order = await orderSchema.findByIdAndDelete({ _id: req.params.id });

        return res.status(200).json({
            message: "Đã xóa 1 order",
            order
        });
    } catch (error) {
        return res.status(404).json({ mesage: "lỗi xóa 1 order !", error })
    }
};