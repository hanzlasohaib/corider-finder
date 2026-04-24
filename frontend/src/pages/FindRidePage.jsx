import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MapPin, Search } from "lucide-react";
import { useRide } from "../context/RideContext";
import { searchRides, joinRide } from "../api/rideService";
import RideCard from "../components/RideCard";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import { RideListSkeleton } from "../components/Skeleton";
import { fieldWithIconClass } from "../lib/formClasses";

function FindRidePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { hasActiveRide, joinedRideIds, refreshRideState } = useRide();

  useEffect(() => {
    refreshRideState();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync on mount only
  }, []);

  const handleSearch = async () => {
    if (!from && !to) {
      toast.error("Enter at least one field");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const data = await searchRides(from, to);
      setRides(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (rideId) => {
    if (hasActiveRide) {
      toast.error("You are already in an active ride");
      return;
    }

    try {
      await joinRide(rideId);
      toast.success("Joined ride");
      await refreshRideState();
    } catch (err) {
      console.error(err);
      toast.error("Failed to join ride");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Find a ride
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Search by pickup, destination, or both — then join a ride that fits
          your route.
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pickup"
                className="text-sm font-medium text-slate-700"
              >
                From
              </label>
              <div className="relative mt-1.5">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="pickup"
                  name="pickup"
                  autoComplete="street-address"
                  placeholder="Pickup area"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className={fieldWithIconClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="destination"
                className="text-sm font-medium text-slate-700"
              >
                To
              </label>
              <div className="relative mt-1.5">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500"
                  aria-hidden
                />
                <input
                  id="destination"
                  name="destination"
                  autoComplete="street-address"
                  placeholder="Destination"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className={fieldWithIconClass}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={loading}
            loading={loading}
            className="shrink-0 lg:self-end"
          >
            Search rides
          </Button>
        </div>
      </Card>

      <section aria-label="Search results" className="space-y-4">
        {loading ? (
          <RideListSkeleton count={3} />
        ) : !hasSearched ? (
          <EmptyState
            icon={Search}
            title="Search for rides"
            description="Enter a starting point or destination and tap Search rides to see matches near you."
          />
        ) : rides.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No rides match"
            description="Try different locations or check back later — new rides are added often."
          />
        ) : (
          rides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onJoin={handleJoin}
              isJoined={joinedRideIds.includes(ride.id)}
            />
          ))
        )}
      </section>
    </div>
  );
}

export default FindRidePage;
