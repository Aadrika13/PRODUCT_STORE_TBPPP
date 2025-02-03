import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [userRole, setUserRole] = useState(null); // Added state for user role
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch admin's products and user role
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsResponse, userResponse] = await Promise.all([
          axios.get("http://localhost:5000/products", {
            withCredentials: true,
          }),
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

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !photo) {
      setError("Please fill in all fields and upload a product photo.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("photo", photo);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/products/add",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProducts([...products, response.data.product]);
      setNewProduct({ name: "", price: "" });
      setPhoto(null);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (loading) return;

    try {
      const response = await fetch(
        `http://localhost:5000/products/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete product");
      }
    } catch (error) {
      setError("Error deleting product. Please try again.");
    }
  };

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
    <div className="admin-dashboard">
      <h2>Product Management</h2>
      {error && <div className="error">{error}</div>}

      {/* Admin specific product management */}
      {userRole === "admin" && (
        <div className="add-product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])} // Set selected file
          />
          {photo && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(photo)}
                alt="Product Preview"
                width="100"
                height="100"
              />
            </div>
          )}
          <button onClick={handleAddProduct} disabled={loading}>
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      )}

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
              {/* Show delete button only for admins */}
              {userRole === "admin" && (
                <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cart Section */}
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

export default AdminDashboard;
