import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Create an order
export const createOrder = async (req, res) => {
  const { productIds, totalAmount } = req.body;

  if (!productIds || !totalAmount) {
    return res.status(400).json({ message: "Product IDs and total amount are required" });
  }

  try {
    // Check if all products exist in the database
    const products = await Product.find({ '_id': { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(404).json({ message: "Some products are not found" });
    }

    // Create a new order
    const newOrder = new Order({
      userId: req.user._id,  // Assuming the user is authenticated and their ID is available in req.user
      productIds: productIds,
      totalAmount: totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders for a specific user
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate("productIds");

    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
