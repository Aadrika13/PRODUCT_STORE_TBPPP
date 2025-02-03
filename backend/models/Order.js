import mongoose from "mongoose";

// Order Schema definition
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending", // Initially, set to Pending; can be updated later to 'Completed' or 'Failed'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Creating the Order model
const Order = mongoose.model("Order", orderSchema);

export default Order;
