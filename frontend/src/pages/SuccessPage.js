import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Payment Successful</h2>
      <p>Your payment was successful. Thank you for your purchase!</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default SuccessPage;
