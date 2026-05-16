const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// @desc    Get admin analytics dashboard data
// @route   GET /api/admin/analytics
// @access  Admin
const getAdminAnalytics = async (req, res) => {
  try {
    const lowStockLimit = 5;

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      orders,
      products,
      lowStockProducts,
      outOfStockProducts,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.find({}),
      Product.find({}),
      Product.find({
        countInStock: { $gt: 0, $lte: lowStockLimit },
      })
        .select("name brand category price countInStock image")
        .sort({ countInStock: 1 }),
      Product.find({
        countInStock: 0,
      })
        .select("name brand category price countInStock image")
        .sort({ updatedAt: -1 }),
      Order.find({})
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const totalRevenue = orders.reduce((total, order) => {
      return total + Number(order.totalPrice || 0);
    }, 0);

    const pendingOrders = orders.filter((order) => !order.isDelivered).length;

    const deliveredOrders = orders.filter((order) => order.isDelivered).length;

    const totalReviews = products.reduce((total, product) => {
      return total + Number(product.numReviews || 0);
    }, 0);

    const productsWithRatings = products.filter(
      (product) => Number(product.rating || 0) > 0
    );

    const averageRating =
      productsWithRatings.length > 0
        ? productsWithRatings.reduce((total, product) => {
            return total + Number(product.rating || 0);
          }, 0) / productsWithRatings.length
        : 0;

    const inventoryValue = products.reduce((total, product) => {
      return (
        total +
        Number(product.price || 0) * Number(product.countInStock || 0)
      );
    }, 0);

    return res.json({
      summary: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        pendingOrders,
        deliveredOrders,
        totalReviews,
        averageRating: Number(averageRating.toFixed(1)),
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        inventoryValue: Number(inventoryValue.toFixed(2)),
      },
      lowStockProducts,
      outOfStockProducts,
      recentOrders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch admin analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminAnalytics,
};