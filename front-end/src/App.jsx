import React, { useEffect, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
  useNavigationType,
} from "react-router-dom";

import Navbar from "./components/Compo/Navbar";
import Dashboard from "./components/pages/dashboard";
import CallLogsTable from "./components/pages/CallLogsTable";
import CRM from "./components/pages/CRM";
import Campaign from "./components/pages/Campaign";
import Reports from "./components/pages/Reports";
import Manage from "./components/pages/Manage";
import Login from "./components/Compo/Login";
import Signup from "./components/Compo/signup";
import ErrorPage from "./components/Errorpage";
import ResetPassword from "./components/Compo/ResetPassword";
import ManageAgents from "./components/pages/ManageAgents";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType(); // 🚨 Detects how user navigated

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });

  if (!isLoggedIn) {
    sessionStorage.removeItem("token");
  }

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(darkMode ? "light" : "dark");
    root.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

  // 🚫 Restrict direct/manual route access
  useEffect(() => {
    const publicPaths = ["/login", "/signup", "/reset-password"];
    const isPublic = publicPaths.includes(location.pathname.toLowerCase());

    const isManual = navigationType === "POP"; // 🚨 Manual typing / browser back / reload

    // 🚨 If user is logged in and tried to go to login/signup manually
    if (isManual && isLoggedIn && isPublic) {
      navigate("/dashboard", { replace: true });
    }

    // 🚨 If user is NOT logged in and tried to access protected route manually
    if (isManual && !isLoggedIn && !isPublic) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigationType, navigate]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
      {!hideNavbar && <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />}
      <div className="p-5">
        <Routes>
          {/* 🔓 Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup onSignup={handleLogin} />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* 🔒 Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/call-logs"
            element={
              <PrivateRoute>
                <CallLogsTable />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaign"
            element={
              <PrivateRoute>
                <Campaign />
              </PrivateRoute>
            }
          />
          <Route
            path="/crm"
            element={
              <PrivateRoute>
                <CRM />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports/*"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage/*"
            element={
              <PrivateRoute>
                <Manage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/ManageAgents" element={<ManageAgents />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
