import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PublicPhoto from "../components/PublicPhoto";

const ctaClass =
  "inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(46,125,50,0.28)] transition-colors hover:bg-brand-700 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

const secondaryCtaClass =
  "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_rgba(46,80,40,0.12)] lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="order-2 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:order-1">
        <h1 className="max-w-[16ch] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Share the ride to campus
        </h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-slate-600">
          CoRide Finder is for university students in Pakistan. Offer or join a
          bike or car hop, split the fare in rupees, and keep it to two seats.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard" className={ctaClass}>
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className={ctaClass}>
                Sign up
              </Link>
              <Link to="/login" className={secondaryCtaClass}>
                Log in
              </Link>
            </>
          )}
        </div>
      </div>

      <PublicPhoto
        kind="home"
        priority
        className="order-1 aspect-[16/10] max-h-56 w-full lg:order-2 lg:aspect-auto lg:max-h-none lg:min-h-[28rem]"
      />
    </div>
  );
}

export default HomePage;
