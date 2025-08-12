import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BsSun, BsMoon } from "react-icons/bs";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ toggleTheme, darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ first_name: "", phone_number: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hideFullNavbar = location.pathname === "/login" || location.pathname === "/signup";
  const showOnlyLogo = location.pathname === "/reset-password";

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://rivoz.in/api/user/user-profile/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserData({
            first_name: data.first_name || "User",
            phone: data.phone || "N/A",
          });
        } else {
          console.error("Unauthorized or invalid response");
          navigate("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (hideFullNavbar) return null;

  const handleLogout = () => {
     sessionStorage.clear();
      navigate("/login", { replace: true });
};

  return (
    <nav
      className={`backdrop-blur-xl border-b shadow-xl px-6 py-4 flex justify-between items-center sticky top-0 z-30 animate-fade-in-down ${
        darkMode ? "bg-gray-900 text-white border-white/20" : "bg-white/60 text-gray-800 border-white/30"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="bg-gradient-to-tr from-[#6366f1] to-[#a18cd1] text-white px-4 py-2 rounded-full font-bold shadow text-lg tracking-wide drop-shadow">
          iVoz
        </span>
        {!showOnlyLogo && (
          <>
            <span className="hidden sm:inline">Hey {userData.first_name}</span>
            <span className="hidden sm:inline text-blue-500 font-semibold ml-2">
              ({userData.phone})
            </span>
          </>
        )}
      </div>

      <button
        className="sm:hidden text-2xl"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`absolute sm:static top-16 right-4 bg-white dark:bg-gray-900 sm:bg-transparent sm:dark:bg-transparent z-50 sm:flex gap-4 md:gap-6 flex-col sm:flex-row p-4 sm:p-0 rounded-xl sm:rounded-none shadow-md sm:shadow-none transition-all duration-300 ${
          isMenuOpen ? "flex" : "hidden"
        }`}
      >
        {["/dashboard", "/call-logs", "/campaign", "/Call Sheet", "/Profile","/Balance"].map((route) => {
          const label = route.split("/")[1].replace("-", " ").replace("", "");
          return (
            <NavLink
              key={route}
              to={route}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `relative px-3 py-1 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-white bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg"
                    : "text-gray-700 dark:text-white hover:text-blue-600 hover:bg-gradient-to-tr hover:from-blue-100 hover:to-purple-100 hover:shadow-md"
                }`
              }
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </NavLink>
          );
        })}

        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="text-xl p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? <BsSun /> : <BsMoon />}
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-1 bg-gradient-to-tr from-red-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
