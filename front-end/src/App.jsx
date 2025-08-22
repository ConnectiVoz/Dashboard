import React, { useEffect, useState } from "react";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
  useNavigationType,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Compo/Navbar";
import Dashboard from "./components/pages/dashboard";
import CallLogsTable from "./components/pages/CallLogsTable";
import CRM from "./components/pages/CRM";
import Campaign from "./components/pages/Campaign";
import Reports from "./components/pages/Reports";
import Profile from "./components/pages/Profile";
import Login from "./components/Compo/Login";
import Signup from "./components/Compo/signup";
import ErrorPage from "./components/Errorpage";
import ResetPassword from "./components/Compo/ResetPassword";
import ManageAgents from "./components/pages/ManageAgents";
import CallList from "./components/pages/CallList";
import Balance from "./components/pages/Balance";
import PostLogin from "./components/pages/PostLogin";
import AgentList from "./components/pages/POST/AgentList";
import CallHistory from "./components/pages/POST/CallHistory";
import CallSheet from "./components/pages/POST/CallSHEET"
import UserDetailsForm from "./components/pages/POST/UserDetailsForm";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  const hideNavbar = 
  location.pathname === "/login" ||
   location.pathname === "/signup";
  //  location.pathname === "/PostLogin";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(darkMode ? "light" : "dark");
    root.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const publicPaths = ["/login", "/signup", "/reset-password"];
    const isPublic = publicPaths.includes(location.pathname.toLowerCase());
    const isManual = navigationType === "POP";
    const token = sessionStorage.getItem("token");

    if (isManual && token && isPublic) {
      navigate("/dashboard", { replace: true });
    }
    // if (isManual && token && isPublic) {
    //   navigate("/PostLogin", { replace: true });
    // }
    if (isManual && !token && !isPublic) {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigationType, navigate]);

  const handleLogin = () => {
    navigate("/dashboard");
  };
  // const handleLogin = () => {
  //   navigate("/PostLogin");
  // };

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
        {/* ✅ Global Toast Container */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
          style={{ marginTop: "60px" }}
        />

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
          {/* <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup onSignup={handleLogin} />
              </PublicRoute>
            }
          /> */}
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
          {/* <Route 
            path="/"
            element={
              <PrivateRoute>
                <PostLogin />
              </PrivateRoute>
            }
            />
          <Route
            path="/PostLogin"
            element={
              <PrivateRoute>
                <PostLogin />
              </PrivateRoute>
            }
          /> */}
  
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
            path="/Call Sheet"
            element={
              <PrivateRoute>
                <CallList />
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
            path="/Profile/*"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/Balance"
            element={
              <PrivateRoute>
                <Balance />
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

          {/* ✅ If you want these pages separately instead of inside PostLogin */}
          <Route
             path="/AgentList"
             element={
              <PrivateRoute>
                <AgentList />
              </PrivateRoute>
             }
            />
          <Route
            path="/UserDetailsForm"
            element={
              <PrivateRoute>
                <UserDetailsForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/CallSHEET"
            element={
              <PrivateRoute>
                <CallSheet/>
              </PrivateRoute>
            }
          />
          <Route
            path="/Call History"
            element={
              <PrivateRoute>
                <CallHistory />
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
