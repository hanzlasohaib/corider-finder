import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../api/userService";
import { CarFront, ChevronDown, LogOut, UserRound } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser()
        .then(setUser)
        .catch(console.error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="group flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <CarFront className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            CoRide Finder
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {!isAuthenticated && (
            <>
              <Link to="/" className={linkClass}>
                Home
              </Link>
              <Link to="/login" className={linkClass}>
                Log in
              </Link>
              <Link
                to="/register"
                className="ml-1 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Sign up
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-controls="account-menu"
                aria-label={
                  user?.full_name ? `Account menu, ${user.full_name}` : "Account menu"
                }
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="hidden max-w-[140px] truncate sm:inline">
                  {user?.full_name || "Account"}
                </span>
                {user?.role === "admin" ? (
                  <span className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 sm:inline">
                    Admin
                  </span>
                ) : null}
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div
                  id="account-menu"
                  className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
                  role="menu"
                >
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    <UserRound className="h-4 w-4 text-slate-400" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:bg-red-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate("/");
                    }}
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
