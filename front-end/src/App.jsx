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
  const navigationType = useNavigationType();

  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(darkMode ? "light" : "dark");
    root.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

  // 🚫 Manual navigation protection
  useEffect(() => {
    const publicPaths = ["/login", "/signup", "/reset-password"];
    const isPublic = publicPaths.includes(location.pathname.toLowerCase());
    const isManual = navigationType === "POP";
    const token = sessionStorage.getItem("token");

    if (isManual && token && isPublic) {
      navigate("/dashboard", { replace: true });
    }
    if (isManual && !token && !isPublic) {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigationType, navigate]);

  const handleLogin = () => {
    navigate("/dashboard");
  };

  const PrivateRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    return token ? <Navigate to="/dashboard" replace /> : children;
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
          <Route
            path="/ManageAgents"
            element={
              <PrivateRoute>
                <ManageAgents />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
