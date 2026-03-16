import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-lg font-semibold text-gray-800">
            CoRide Finder
          </h1>

          <nav className="flex gap-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">
              Home
            </Link>
            <Link to="/login" className="hover:text-gray-900">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-900">
              Register
            </Link>
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
