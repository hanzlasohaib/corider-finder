import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PublicPhoto from "../components/PublicPhoto";

function NotFound() {
  const { isAuthenticated } = useAuth();
  const homeTo = isAuthenticated ? "/dashboard" : "/";

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_rgba(46,80,40,0.12)]">
      <PublicPhoto kind="auth" priority className="aspect-[16/8] max-h-40 w-full" />
      <div className="px-6 py-8 text-center sm:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-slate-600">
          That address is not part of CoRide Finder.
        </p>
        <Link
          to={homeTo}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          {isAuthenticated ? "Back to dashboard" : "Go home"}
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
