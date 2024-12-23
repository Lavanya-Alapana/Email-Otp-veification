import React, { useState } from "react";
import axios from "axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://your-backend-url/verify-otp", { email, otp });
      if (response.data.success) {
        setMessage("OTP verified successfully!");
      } else {
        setMessage("Invalid OTP. Try again.");
      }
    } catch (error) {
      setMessage("Error verifying OTP.");
    }
  };

  return (
    <div>
      <h2>Enter OTP to Verify</h2>
      <form onSubmit={handleVerify}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit">Verify OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyOtp;
