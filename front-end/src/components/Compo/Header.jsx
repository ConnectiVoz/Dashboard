import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { format } from "date-fns";

const Header = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <header
      className="bg-white/40 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg py-3 px-3 sm:px-6 w-full z-40"
      data-aos="fade-down"
      style={{
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        border: "1px solid rgba(255,255,255,0.18)"
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-gray-800 drop-shadow">
            Welcome Back <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500">{currentDate}</p>
        </div>
        <div className="bg-gradient-to-tr from-[#e0e7ff]/70 to-[#fbc2eb]/70 px-2 py-2 rounded-lg shadow-lg hover:shadow-xl transition hover:scale-105 cursor-pointer flex items-center backdrop-blur-sm">
          <img
            src="/dashboard-image.png"
            height={60}
            width={60}
            className="rounded-full object-cover border-2 border-white/60 shadow"
            alt="Dashboard"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;