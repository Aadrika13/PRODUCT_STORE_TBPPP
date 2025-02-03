import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [userRole, setUserRole] = useState(null); // Added state for user role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products and user role
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsResponse, userResponse] = await Promise.all([
          axios.get("http://localhost:5000/products", { withCredentials: true }),
          axios.get("http://localhost:5000/user/role", { // Assuming there's an endpoint for getting the user role
            withCredentials: true,
          }),
        ]);
        
        setProducts(productsResponse.data);
        setUserRole(userResponse.data.role); // Set user role from response

      } catch (err) {
        setError("Failed to fetch products or user data. Please log in.");
        navigate("/"); // Redirect to login if unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const existingProductIndex = updatedCart.findIndex(
        (item) => item._id === product._id
      );
      if (existingProductIndex >= 0) {
        updatedCart[existingProductIndex].quantity += 1; // Increase quantity if product already in cart
      } else {
        updatedCart.push({ ...product, quantity: 1 }); // Add new product to cart
      }
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((product) => product._id !== productId));
  };

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      {error && <div className="error">{error}</div>}

      {/* Loading spinner */}
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.photo} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              {/* Only show "Add to Cart" button for users */}
              {userRole === "user" && (
                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cart Section for Users */}
      {userRole === "user" && (
        <div className="cart">
          <h3>Shopping Cart</h3>
          {cart.length > 0 ? (
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item._id}>
                  <img src={item.photo} alt={item.name} width="50" height="50" />
                  <p>{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
                </div>
              ))}
              <div className="cart-total">
                <p>Total Items: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
                <p>
                  Total Price: $
                  {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
                </p>
              </div>
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
