import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import "../styles/Checkout.css";

// Load your public Stripe key
const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

const Checkout = ({ cart, clearCart }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty. Please add products to the cart.");
      return;
    }

    try {
      // Calculate the total amount
      const totalAmount = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Create a Stripe checkout session
      const response = await axios.post("http://localhost:5000/create-checkout-session", {
        cart,
        totalAmount,
      });

      // Redirect to Stripe's checkout page
      const { sessionId } = response.data;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        setError("Payment failed. Please try again.");
      }
    } catch (error) {
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {error && <div className="error">{error}</div>}

      <div className="cart-summary">
        <h3>Cart Summary</h3>
        <div className="cart-items">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <img src={item.photo} alt={item.name} width="50" height="50" />
                <p>{item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        <div className="cart-total">
          <p>Total Items: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
          <p>
            Total Price: $$
            {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
          </p>
        </div>
      </div>

      {/* Payment Button */}
      <div className="checkout-actions">
        {paymentStatus ? (
          <div className="payment-status">{paymentStatus}</div>
        ) : (
          <button onClick={handleCheckout} className="checkout-button">
            Proceed to Payment
          </button>
        )}
      </div>
    </div>
  );
};

// Wrap Checkout with Stripe Elements provider
const StripeCheckout = ({ cart, clearCart }) => (
  <Elements stripe={stripePromise}>
    <Checkout cart={cart} clearCart={clearCart} />
  </Elements>
);

export default StripeCheckout;
