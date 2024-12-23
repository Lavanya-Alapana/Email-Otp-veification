import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const OTPVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/send-otp", {
        email,
      });
      console.log("Send OTP Response:", response.data);

      // Mask email for display
      const masked = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => `${a}${"*".repeat(b.length)}${c}`);
      setMaskedEmail(masked);
      setIsOtpSent(true);
      setMessage("");
    } catch (error) {
      console.error("Send OTP Error:", error.response || error);
      setMessage(error.response?.data || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const otpString = otp.join(""); // Combine OTP inputs
      const response = await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp: otpString,
      });
      console.log("Verify OTP Response:", response.data);
      setMessage(response.data.message || "OTP verified successfully");
    } catch (error) {
      console.error("Verify OTP Error:", error.response || error);
      setMessage(error.response?.data || "Invalid OTP");
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center", marginTop: "100px" }}>
      <h1 className="text-primary">OTP Verification</h1>
      <div className="mt-3 row">
        <div className="col-8">
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-4">
          <button className="btn btn-primary w-100 mb-2" onClick={sendOtp}>
            Send OTP
          </button>
        </div>
      </div>
      {isOtpSent && (
        <p className="text-success mb-3">
          An OTP has been sent to <strong>{maskedEmail}</strong>
        </p>
      )}
      {isOtpSent && (
        <>
          <p className="text-success mt-3">Please enter OTP to verify</p>
          <div
            className="d-flex justify-content-center gap-3 mb-3"
            style={{
              maxWidth: "400px",
              margin: "auto",
              // Background color for OTP input box
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                className="form-control text-center"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                style={{
                  width: "50px",
                  height: "50px",
                  fontSize: "1.5rem",
                  border: "2px solid green",
                  borderRadius: "5px",
                }}
              />
            ))}
          </div>
          <button className="btn btn-success w-50" onClick={verifyOtp}>
            Verify OTP
          </button>
        </>
      )}
      {message && <p className="mt-3 text-success">{message}</p>}
    </div>
  );
};

export default OTPVerification;
