import React, { useState, useEffect } from "react";
import { Route, Routes, NavLink, useLocation } from "react-router-dom";
import { FaUser, FaShieldAlt, FaLock, FaBook, FaRobot } from "react-icons/fa";

import User from "./User";
import Security from "./Security";
import Password from "./Password";
import KnowledgeBase from "./KnowledgeBase";
import Agents from "./Agents";

function Manage() {
  const location = useLocation();
  const [userData, setUserData] = useState({ first_name: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://rivoz.in/api/user/user-profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserData({ first_name: data.first_name || "User" });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const navLinks = [
    { to: "/Profile/user", label: "User", icon: <FaUser /> },
    // { to: "/manage/security", label: "Security", icon: <FaShieldAlt /> },
    { to: "/Profile/password", label: "Password", icon: <FaLock /> },
    // { to: "/manage/knowledgebase", label: "KB", icon: <FaBook /> },
    // { to: "/manage/agents", label: "Agents", icon: <FaRobot /> },
  ];

  return (
    <div className="bg-gradient-to-br from-[#e0e7ff]/60 via-[#f8fafc]/80 to-[#fbc2eb]/60 min-h-screen flex flex-col pb-20">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-xl rounded-2xl mx-4 mt-4 mb-4 animate-fade-in-down">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-tr from-[#6366f1] to-[#a18cd1] text-white px-4 py-2 rounded-full font-bold shadow text-lg tracking-wide drop-shadow">
            iVoz
          </span>
          <span className="text-gray-700 font-semibold text-lg">({userData.first_name})</span>
        </div>
      </nav>

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-2 md:px-6">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block bg-white/60 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6 w-64 mr-6 animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 drop-shadow">Your Profile</h2>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-xl font-semibold transition-all duration-200
                    ${isActive
                      ? "bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gradient-to-tr hover:from-blue-100 hover:to-purple-100 hover:text-blue-700 hover:shadow-md"}`
                  }
                >
                  {link.icon} {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 animate-fade-in-up mb-6">
          <Routes>
            <Route path="/" element={<User />} />
            <Route path="user" element={<User />} />
            <Route path="security" element={<Security />} />
            <Route path="password" element={<Password />} />
            <Route path="knowledgebase" element={<KnowledgeBase />} />
            <Route path="agents" element={<Agents />} />
          </Routes>
        </main>
      </div>

      {/* Bottom mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-t border-white/30 shadow-t-xl flex justify-around py-2 px-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs transition-all duration-200
              ${isActive ? "text-purple-600 scale-110" : "text-gray-600 hover:text-purple-400"}`
            }
          >
            <div className="text-lg">{link.icon}</div>
            <div className="text-[10px]">{link.label}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Manage;
