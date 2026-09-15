import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isAuthPortal =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app-shell flex min-h-screen flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {isDashboard || isAuthPortal ? (
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
