import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="app-shell flex min-h-screen flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
      <Navbar />

      <main className="flex-1">
        {isDashboard ? (
          <Outlet />
        ) : (
          <div className="animate-page-in mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}

export default Layout;
