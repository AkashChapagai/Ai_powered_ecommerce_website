const mongoose = require("mongoose");
const Order = require("../models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items found" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const mappedOrderItems = orderItems.map((item) => {
      return {
        name: item.name,
        qty: Number(item.qty || item.quantity || 1),
        image: item.image,
        price: Number(item.price),
        product: item.product || item._id || item.id,
      };
    });

    const hasInvalidItem = mappedOrderItems.some(
      (item) =>
        !item.name ||
        !item.image ||
        !item.product ||
        !item.qty ||
        item.qty < 1 ||
        Number.isNaN(item.price)
    );

    if (hasInvalidItem) {
      return res.status(400).json({
        message: "Invalid order item data",
      });
    }

    const itemsPrice = mappedOrderItems.reduce((total, item) => {
      return total + item.price * item.qty;
    }, 0);

    const finalShippingPrice =
      shippingPrice !== undefined ? Number(shippingPrice) : itemsPrice > 100 ? 0 : 4.99;

    const finalTaxPrice =
      taxPrice !== undefined ? Number(taxPrice) : Number((itemsPrice * 0.2).toFixed(2));

    const totalPrice = Number(
      (itemsPrice + finalShippingPrice + finalTaxPrice).toFixed(2)
    );

    const order = new Order({
      user: req.user._id,
      orderItems: mappedOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice: finalShippingPrice,
      taxPrice: finalTaxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    return res.status(201).json(createdOrder);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch your orders",
      error: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to view this order",
      });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    return res.json(updatedOrder);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update delivery status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderToDelivered,
};