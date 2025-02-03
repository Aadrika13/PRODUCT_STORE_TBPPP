import express from "express";
import { createOrder, getOrdersByUser } from "../controllers/orderController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Create a new order route (requires authentication)
router.post("/create", ensureAuthenticated, createOrder);

// Get all orders for the authenticated user
router.get("/", ensureAuthenticated, getOrdersByUser);

export default router;
