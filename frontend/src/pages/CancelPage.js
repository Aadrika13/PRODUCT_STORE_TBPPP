import React from "react";
import { useNavigate } from "react-router-dom";

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Payment Cancelled</h2>
      <p>Your payment was cancelled. Please try again.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default CancelPage;
