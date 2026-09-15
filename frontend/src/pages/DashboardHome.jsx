import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useRide } from "../context/RideContext";
import { Car, Compass } from "lucide-react";
import {
  getMyCreatedRides,
  getMyJoinedRides,
  getAvailableRides,
  joinRide,
} from "../api/rideService";

import RideCard from "../components/RideCard";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { RideListSkeleton } from "../components/Skeleton";
import { apiErrorMessage } from "../lib/apiError";

function DashboardHome() {
  const navigate = useNavigate();

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { joinedRideIds, hasActiveRide, refreshRideState } = useRide();
  const [rides, setRides] = useState([]);
  const [createdCount, setCreatedCount] = useState(0);
  const [joinedCount, setJoinedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const loadData = async () => {
      try {
        const created = await getMyCreatedRides();
        const joined = await getMyJoinedRides();

        setCreatedCount(created.length);
        setJoinedCount(joined.length);

        const available = await getAvailableRides();
        setRides(available);
      } catch (err) {
        console.error("Dashboard error:", err);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authLoading, isAuthenticated]);

  const handleJoin = async (rideId) => {
    if (hasActiveRide) {
      toast.error("You are already in an active ride");
      throw new Error("already-in-ride");
    }

    try {
      await joinRide(rideId);
      toast.success("Joined ride. It is on My rides.");
      await refreshRideState();
      navigate("/dashboard/myrides");
    } catch (err) {
      console.error(err);
      toast.error(apiErrorMessage(err, "Could not join this ride. Try again."));
      throw err;
    }
  };

  const statClass =
    "rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-colors hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Open trips from other students. Join one here, or search a route.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          className={statClass}
          onClick={() => navigate("/dashboard/myrides")}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Created
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
            {loading ? "—" : createdCount}
          </p>
        </button>

        <button
          type="button"
          className={statClass}
          onClick={() => navigate("/dashboard/myrides")}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Joined
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
            {loading ? "—" : joinedCount}
          </p>
        </button>

        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm ring-1 ring-brand-100 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600/80">
            Offer
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard/offer")}
            className="mt-4 w-full"
          >
            <Car className="h-4 w-4" strokeWidth={2} />
            Offer a ride
          </Button>
        </div>
      </div>

      <section aria-labelledby="available-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              id="available-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Available rides
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Upcoming open trips. Join from the card.
            </p>
          </div>
          <Link
            to="/dashboard/find"
            className="shrink-0 text-sm font-medium text-brand-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Search a route
          </Link>
        </div>

        {loading ? (
          <RideListSkeleton count={2} />
        ) : rides.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="Nothing available right now"
            description="Check back soon, or offer a ride of your own."
            action={
              <Button variant="outline" onClick={() => navigate("/dashboard/offer")}>
                Offer a ride
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onJoin={handleJoin}
                isJoined={joinedRideIds.includes(ride.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardHome;
