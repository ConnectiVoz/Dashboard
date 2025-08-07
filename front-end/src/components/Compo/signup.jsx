import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Signup({ onSignup }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    company: "",
    address: "",
    city: "",
    state: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSignupError("");
  setSignupSuccess("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!formData.firstName || !formData.email || !formData.password) {
    setSignupError("First name, email, and password are required.");
    return;
  }

  if (!emailRegex.test(formData.email)) {
    setSignupError("Invalid email format.");
    return;
  }

  if (!phoneRegex.test(formData.phone)) {
    setSignupError("Phone number must be 10 digits.");
    return;
  }

  if (!passwordRegex.test(formData.password)) {
    setSignupError("Password must have 8+ chars, 1 capital, 1 number, and 1 special character.");
    return;
  }

  const payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phone_number: formData.phone,
    password: formData.password,
    company_name: formData.company,
    address: formData.address,
    city: formData.city,
    state: formData.state,
  };

  console.log("Registering user with data:", payload); // Confirm this logs correctly

  try {
    const response = await fetch("https://3.95.238.222/api/user/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resData = await response.json();

    if (response.ok) {
      setSignupSuccess("Signup successful! Redirecting to dashboard...");
      sessionStorage.setItem("user", JSON.stringify(payload));
      if (onSignup) onSignup();
    } else {
      setSignupError(resData.detail || resData.message || "Signup failed. Try again.");
    }
  } catch (error) {
    setSignupError("Network error. Please try again.");
  }
};


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden font-sans py-10 px-4">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://i.pinimg.com/originals/77/12/1e/77121e2e807262558a7a38d2c7c09cea.gif"
          alt="bg animation"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white/10 backdrop-blur-md rounded-2xl shadow-[0_0_60px_rgba(255,255,255,0.1)] border border-white/10 overflow-hidden transition-all duration-500">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-center items-start px-10 w-1/2 text-white space-y-6 bg-gradient-to-br from-purple-800/30 via-transparent to-blue-700/30">
          <h2 className="text-4xl font-bold leading-tight">Welcome</h2>
          <p className="text-lg text-gray-300">Unlock your digital journey by creating an account.</p>
          <p className="text-sm text-gray-400">
            Already a user? <NavLink to="/" className="text-white underline">Login here</NavLink>
          </p>
        </div>

        {/* Right Section - Signup Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-2">
              <img
                src="https://ivoz.ai/wp-content/uploads/2025/04/Red-Black-Minimalist-Tech-Connect-Logo-2906-x-876-px-700-x-492-.png"
                alt="IVOZ Logo"
                className="w-24 object-contain hover:scale-110 transition-transform duration-300"
              />
              <p className="text-white text-sm font-semibold">
                Empower <span className="text-yellow-400">Conversations.</span>
                <br />
                Redefine Connections.
              </p>
            </div>
            <h2 className="text-white text-3xl font-bold">Create an Account</h2>
          </div>

          <form className="space-y-4 text-white" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                placeholder="First Name"
                required
                className="w-full p-3 bg-transparent border border-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                placeholder="Last Name"
                className="w-full p-3 bg-transparent border border-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Work Email"
              required
              className="w-full p-3 bg-transparent border border-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Phone Number (10 digits)"
              maxLength={10}
              required
              className="w-full p-3 bg-transparent border border-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password + Toggle */}
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full p-3 pr-10 bg-transparent border border-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-sm hover:text-yellow-400 transition duration-200"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              type="text"
              placeholder="Company Name"
              className="w-full p-3 bg-transparent border border-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              type="text"
              placeholder="Address"
              required
              className="w-full p-3 bg-transparent border border-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-4">
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                type="text"
                placeholder="City"
                className="w-full p-3 bg-transparent border border-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                type="text"
                placeholder="State"
                className="w-full p-3 bg-transparent border border-white rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {signupError && <div className="text-center text-red-500">{signupError}</div>}
            {signupSuccess && <div className="text-center text-green-500">{signupSuccess}</div>}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 text-white font-bold rounded-md hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
