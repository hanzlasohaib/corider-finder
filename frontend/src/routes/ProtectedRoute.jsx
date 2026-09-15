import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { safeDashboardPath } from "../lib/navigation";

function LoadingScreen() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center text-sm font-medium text-slate-500"
      role="status"
    >
      Loading account
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    const next = `${location.pathname}${location.search}`;
    const params = new URLSearchParams();
    if (next.startsWith("/dashboard")) {
      params.set("next", next);
    }
    const query = params.toString();
    return <Navigate to={query ? `/login?${query}` : "/login"} replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    const next = new URLSearchParams(location.search).get("next");
    return <Navigate to={safeDashboardPath(next)} replace />;
  }

  return children;
}

export default ProtectedRoute;
