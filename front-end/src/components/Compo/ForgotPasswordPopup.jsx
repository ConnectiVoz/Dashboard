import React, { useState } from "react";
import { toast } from "react-toastify";

const ForgotPasswordPopup = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) return;

    try {
      const response = await fetch(`https://3.95.238.222/api/user/forgot-password/?email=${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("Reset link sent to your email!");
        setMessage("Reset link sent to your email!");
        setTimeout(() => {
          onClose();
          setEmail("");
          setMessage("");
        }, 2000);
      } else {
        const resData = await response.json();
        toast.error(resData.message || "Failed to send reset link.");
        setError(resData.message || "Failed to send reset link.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-[1000]">
      <div className="relative bg-white p-8 rounded-xl w-[90%] max-w-md shadow-2xl z-10">
        <button
          className="absolute top-2 right-4 text-2xl text-gray-700 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-2 text-center">Forgot Password?</h2>
        <p className="text-sm text-gray-600 mb-5 text-center">
          Enter your registered email. We’ll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-sm mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {message && <div className="text-green-600 text-center text-sm">{message}</div>}
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}

          <button
            type="submit"
            disabled={!email}
            className="w-full bg-black text-white py-2 rounded-md font-semibold 
                       hover:bg-white hover:text-black hover:border hover:border-black 
                       disabled:bg-gray-400 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <a href="#" onClick={onClose} className="text-blue-600 hover:underline">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
