import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // <-- New state

  const backendURL = "https://rivoz.in"; // ⚠️ Use http if no SSL configured

  // ✅ Auto-login if token exists
  useEffect(() => {
    const existingToken = sessionStorage.getItem("token");
    if (existingToken) {
      console.log("✅ Token found, redirecting to dashboard...");
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true); // Disable button here

    try {
      const response = await fetch(`${backendURL}/api/user/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("❌ JSON parsing failed:", err);
          setLoginError("Invalid server response. Please contact support.");
          toast.error("Invalid server response.");
          setIsLoggingIn(false);
          return;
        }

        console.log("✅ Login success:", data);

        // ✅ Save token & user
        sessionStorage.setItem("token", data.token || "dummy_token");
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email || "",
            phone_number: data.phone_number || "",
          })
        );

        toast.success("Login successful!");
        setIsLoggingIn(false);
        window.location.href = "/dashboard";
        if (onLogin) onLogin();
      } else {
        const err = await response.json();
        setLoginError(err.message || "Invalid credentials.");
        toast.error(err.message || "Invalid credentials.");
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setLoginError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setResetMsg("Please enter your email.");
      return;
    }

    const url = `${backendURL}/api/user/forgot-password/?email=${encodeURIComponent(
      resetEmail
    )}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const contentType = res.headers.get("content-type");

      if (res.ok && contentType?.includes("application/json")) {
        toast.success("Reset link sent to your email!");
        const data = await res.json();
        console.log("✅ Forgot password success:", data);
        setResetMsg("Reset link sent to your email!");
      } else {
        const text = await res.text();
        console.warn("⚠️ HTML or unexpected response received:", text);
        setResetMsg("Reset failed. Please try again.");
      }
    } catch (err) {
      console.log("❌ Forgot password error:", err);
      setResetMsg("Something went wrong.");
    }

    setTimeout(() => {
      setResetMsg("");
      setResetEmail("");
      setShowForgotModal(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-black/20 to-black/40 animate-pulse"></div>
        <img
          src="https://i.pinimg.com/originals/77/12/1e/77121e2e807262558a7a38d2c7c09cea.gif"
          alt="bg"
          className="w-full h-full object-cover mix-blend-overlay opacity-20 grayscale"
        />
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm relative animate-fade-in-up">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => {
                setShowForgotModal(false);
                setResetMsg("");
                setResetEmail("");
              }}
              title="Close"
            >
              ×
            </button>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <h2 className="text-xl font-bold text-black mb-2">Forgot Password</h2>
              <p className="text-gray-700 mb-2 text-sm">
                Enter your email to receive a password reset link.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-3 bg-gray-100 text-black rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 text-white font-bold rounded-md hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer"
              >
                Send Reset Link
              </button>
              {resetMsg && (
                <div className="text-center text-sm text-green-600">{resetMsg}</div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Login Content */}
      <div className="relative z-10 w-full max-w-6xl px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        <div className="flex-1 text-white space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome <span className="text-indigo-400">Back</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Let's redefine how you connect — securely and beautifully.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-white via-gray-300 to-white text-black font-bold rounded-lg hover:scale-105 hover:shadow-white/30 active:scale-95 transition-all duration-300 shadow-md cursor-pointer">
            Get Started
          </button>
        </div>

        <div className="flex-1 bg-black/50 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.4)] w-full relative">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="https://ivoz.ai/wp-content/uploads/2025/04/Red-Black-Minimalist-Tech-Connect-Logo-2906-x-876-px-700-x-492-.png"
              alt="logo"
              className="w-24 object-contain hover:scale-110 transition-transform duration-300"
            />
            <p className="text-white text-sm font-semibold">
              Empower <span className="text-yellow-400">Conversations.</span>
              <br />
              Redefine Connections.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-white mb-1">Login</h2>
          <p className="text-gray-400 text-sm mb-6">Glad you're back.!</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white/10 text-white placeholder-gray-300 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              disabled={isLoggingIn}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="🔐 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/10 text-white placeholder-gray-300 rounded-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              disabled={isLoggingIn}
            />

            <div className="flex justify-between items-center text-sm text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-indigo-500"
                  onChange={() => setShowPassword(!showPassword)}
                  disabled={isLoggingIn}
                />
                Show Password
              </label>
              <button
                type="button"
                className="hover:underline text-indigo-400 cursor-pointer"
                onClick={() => setShowForgotModal(true)}
                disabled={isLoggingIn}
              >
                Forgot password?
              </button>
            </div>

            {loginError && (
              <div className="text-center text-sm text-red-500">{loginError}</div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 text-white font-bold rounded-md shadow-lg transition-all duration-300 cursor-pointer
                ${isLoggingIn ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95 hover:shadow-purple-500/30"}`}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center justify-center gap-6 mt-6">
              <a href="https://www.google.com/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer text-lg">
                <FaGoogle />
              </a>
              <a href="https://www.facebook.com/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-all cursor-pointer text-lg">
                <FaFacebookF />
              </a>
              <a href="https://github.com/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gray-800 transition-all cursor-pointer text-lg">
                <FaGithub />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
