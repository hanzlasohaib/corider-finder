import { useState, useEffect, lazy, Suspense } from "react";
import toast from "react-hot-toast";
import { MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRide } from "../context/RideContext";
import { searchRides, joinRide, getAvailableRides } from "../api/rideService";
import RideCard from "../components/RideCard";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import { RideListSkeleton } from "../components/Skeleton";
import { fieldWithIconClass } from "../lib/formClasses";
import { apiErrorMessage } from "../lib/apiError";

const FindRideMap = lazy(() => import("../components/FindRideMap"));

function FindRidePage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  const { hasActiveRide, joinedRideIds, refreshRideState } = useRide();
  const isFiltered = Boolean(appliedFrom || appliedTo);
  const canClear = isFiltered || Boolean(from.trim() || to.trim());

  const loadRides = async (pickup = "", destination = "") => {
    const pickupValue = pickup.trim();
    const destValue = destination.trim();

    try {
      setLoading(true);
      const data =
        pickupValue || destValue
          ? await searchRides(pickupValue, destValue)
          : await getAvailableRides();
      setRides(data);
      setAppliedFrom(pickupValue);
      setAppliedTo(destValue);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRideState();
    loadRides("", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- browse on mount only
  }, []);

  const handleSearch = async () => {
    await loadRides(from, to);
  };

  const handleClear = async () => {
    setFrom("");
    setTo("");
    await loadRides("", "");
  };

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Find a ride
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Open trips are listed below. Filter by pickup or destination if you
          want a tighter match.
        </p>
      </div>

      <Card>
        <form
          className="flex flex-col gap-4 lg:flex-row lg:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
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

          <div className="flex shrink-0 flex-wrap gap-2 lg:self-end">
            <Button type="submit" disabled={loading} loading={loading}>
              Search rides
            </Button>
            {canClear && (
              <Button
                type="button"
                variant="ghost"
                disabled={loading}
                onClick={handleClear}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </Card>

      {!loading && rides.length > 0 ? (
        <Suspense fallback={<div className="h-72 rounded-2xl bg-stone-200" aria-hidden />}>
          <FindRideMap
          rides={rides}
          onSelectRide={(rideId) => {
            document
              .getElementById(`ride-${rideId}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />
        </Suspense>
      ) : null}

      <section
        aria-label={isFiltered ? "Matching rides" : "Open rides"}
        className="space-y-4"
      >
        {loading ? (
          <RideListSkeleton count={3} />
        ) : rides.length === 0 ? (
          <EmptyState
            icon={isFiltered ? MapPin : Search}
            title={isFiltered ? "No rides match" : "Nothing available right now"}
            description={
              isFiltered
                ? "Try different locations, or clear the search to see all open trips."
                : "Check back soon, or offer a ride of your own."
            }
            action={
              isFiltered ? (
                <Button variant="outline" onClick={handleClear}>
                  Clear search
                </Button>
              ) : null
            }
          />
        ) : (
          rides.map((ride) => (
            <div key={ride.id} id={`ride-${ride.id}`}>
              <RideCard
                ride={ride}
                onJoin={handleJoin}
                isJoined={joinedRideIds.includes(ride.id)}
              />
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default FindRidePage;
