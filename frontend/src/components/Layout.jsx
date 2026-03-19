import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../api/userService";
import { Outlet, Link, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const isDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser()
        .then(setUser)
        .catch(console.error);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-lg font-semibold text-gray-800">
            CoRide Finder
          </h1>

          <nav className="flex items-center gap-6 text-sm text-gray-600">

            {/* Public Nav */}
            {!isAuthenticated && (
              <>
                <Link to="/" className="hover:text-gray-900">Home</Link>
                <Link to="/login" className="hover:text-gray-900">Login</Link>
                <Link to="/register" className="hover:text-gray-900">Register</Link>
              </>
            )}



            {/* Private Nav */}
            {isAuthenticated && isDashboard && (
    <div className="relative">

      {/* User Name Button */}
      <button
        onClick={() => setOpen(!open)}
        className="font-medium text-gray-800"
      >
        👤 {user?.full_name || "User"}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">

          <Link
            to="/dashboard/profile"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>

          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
          >
            Logout
          </button>

        </div>
      )}

    </div>
  )}



          </nav>

        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

export default Layout;