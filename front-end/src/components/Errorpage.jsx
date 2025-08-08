// src/pages/ErrorPage.jsx
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const isAuthenticated = !!sessionStorage.getItem("token"); // or localStorage.getItem("token")

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white text-center px-4">
      <h1 className="text-7xl font-extrabold mb-4 animate-bounce">404</h1>
      <p className="text-2xl mb-2">Oops! Page not found.</p>
      <p className="text-gray-400 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>

      {isAuthenticated ? (
        <Link
          to="/dashboard"
          className="bg-purple-600 hover:bg-purple-800 transition-all text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Go back to Home
        </Link>
      ) : (
        <Link
          to="/login"
          className="bg-purple-600 hover:bg-purple-800 transition-all text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Go back to Home
        </Link>
      )}
    </div>
  );
};

export default ErrorPage;
