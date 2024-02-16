import Order from "../models/order.js";



// Thống kê theo ngày
// Thống kê theo khoảng thời gian
export const generateStatisticsForDateRange = async (req, res) => {
  try {
    const requestedStartDate = new Date(req.body.startDate);
    const requestedEndDate = new Date(req.body.endDate);

    if (!requestedStartDate || isNaN(requestedStartDate) || !requestedEndDate || isNaN(requestedEndDate)) {
      return res.status(400).json({ success: false, error: "Invalid date format" });
    }

    // Set the time part of the dates to match the entire day
    requestedStartDate.setHours(0, 0, 0, 0);
    requestedEndDate.setHours(23, 59, 59, 999);

    // Lấy múi giờ hiện tại của máy chủ
    const serverTimeZoneOffset = new Date().getTimezoneOffset() * 60000;

    // Điều chỉnh ngày theo múi giờ của máy chủ
    const adjustedStartDate = new Date(requestedStartDate.getTime() - serverTimeZoneOffset);
    const adjustedEndDate = new Date(requestedEndDate.getTime() - serverTimeZoneOffset);

    const statistics = await generateStatistics(
      adjustedStartDate,
      adjustedEndDate
    );

    res.status(200).json({
      success: true,
      message: "lấy dữ liệu thành công",
      statistics,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Thống kê theo tháng
export const generateStatisticsForSpecificOrCurrentMonth = async (req, res) => {
  try {
    const { month } = req.body;

    let startDate, endDate;

    if (month) {
      const [year, monthNumber] = month.split("-");
      startDate = new Date(Date.UTC(year, parseInt(monthNumber, 10) - 1, 1));
      endDate = new Date(Date.UTC(year, parseInt(monthNumber, 10), 0, 23, 59, 59, 999));
    } else {
      // Default to the current month
      const currentDate = new Date();
      startDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
      endDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999));
    }

    const statistics = await generateStatistics(
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      message: "Statistics for the specified or current month generated successfully",
      statistics,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};



const generateStatistics = async (startDate, endDate) => {
    const orders = await Order.find({
        createdAt: { $gte: startDate, $lt: endDate },
    }).populate("products.productId", "name price");

    let totalQuantity = 0; // tổng số lượng bán được
    let totalRevenue = 0; // tổng doanh thu

    const statistics = [];

    for (const order of orders) {
        for (const product of order.products) {
            const statistic = {
                date: startDate,
                productId: product.productId?._id,
                quantity: product.quantity,
                
            };
            

            statistics.push(statistic);
            totalQuantity += product.quantity;
        }
        totalRevenue += order.totalPrice
    }

    return { startDate, totalQuantity, orders, totalRevenue,endDate };
};
