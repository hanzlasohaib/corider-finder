import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, Compass, Search } from "lucide-react";
import {
  getMyCreatedRides,
  getMyJoinedRides,
  getAvailableRides,
} from "../api/rideService";
import { getCurrentUser } from "../api/userService";

import RideCard from "../components/RideCard";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { RideListSkeleton } from "../components/Skeleton";

function DashboardHome() {
  const navigate = useNavigate();

  const { isAuthenticated, loading: authLoading } = useAuth();
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

        const currentUser = await getCurrentUser();
        const available = await getAvailableRides(currentUser.id);
        setRides(available);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authLoading, isAuthenticated]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Quick stats and rides that match your profile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Created
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
            {loading ? "—" : createdCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Joined
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
            {loading ? "—" : joinedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm ring-1 ring-brand-100 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600/80">
            Quick action
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

        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quick action
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard/find")}
            className="mt-4 w-full"
          >
            <Search className="h-4 w-4" strokeWidth={2} />
            Find a ride
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
              Open trips you may be able to join.
            </p>
          </div>
        </div>

        {loading ? (
          <RideListSkeleton count={2} />
        ) : rides.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="Nothing available right now"
            description="Check back soon or use Find ride to search a wider set of routes."
            action={
              <Button variant="outline" onClick={() => navigate("/dashboard/find")}>
                Browse rides
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardHome;
