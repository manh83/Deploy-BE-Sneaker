import Product from "../models/product.js"

export const searchProduct = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Thiếu truy vấn tìm kiếm' });
    }

    // Chia nhỏ từ khóa thành các từ đơn lẻ
    const keywords = query.split(' ').filter(Boolean);

    // Tạo mảng điều kiện cho mỗi từ khóa
    const conditions = keywords.map(keyword => ({
      name: { $regex: new RegExp(keyword, 'i') }
    }));

    // Thực hiện tìm kiếm với mảng điều kiện
    const results = await Product.find({ $or: conditions });
    if(results.length === 0){
      return res.json({
        message: "Không có sản phẩm nào"
      })
    }

    return res.json({message: "Đã tìm kiếm được",results});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
